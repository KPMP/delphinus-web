import { noSlidesFound, downloadSlide, getNextSlide, getPreviousSlide, 
	getStainImageName, determineIfSlideTooLargeForGrid, getNextLetterInAlphabet, 
	getGridOverlay } from './slideHelpers';

describe('noSlidesFound', () => {

	it('should redirect when the object contains an empty array', () => {
		let handleError = jest.fn();
		noSlidesFound({ slides: [] }, handleError);
		expect(handleError).toHaveBeenCalledTimes(1);
		expect(handleError).toHaveBeenCalledWith({ error: 'No participant selected. No slides to show.', stackTrace: '' });
	});

	it('should redirect when the object passed in is null', () => {
		let handleError = jest.fn();
		noSlidesFound(null, handleError);
		expect(handleError).toHaveBeenCalledTimes(1);
		expect(handleError).toHaveBeenCalledWith({ error: 'No participant selected. No slides to show.', stackTrace: '' });
	});

	it('should redirect when the object passed in is undefined', () => {
		let handleError = jest.fn();
		noSlidesFound(undefined, handleError);
		expect(handleError).toHaveBeenCalledTimes(1);
		expect(handleError).toHaveBeenCalledWith({ error: 'No participant selected. No slides to show.', stackTrace: '' });
	});

	it('should do nothing when the object passed in has items in the array', () => {
		let handleError = jest.fn();
		noSlidesFound({ slides: [{ key: 'value' }] }, handleError);
		expect(handleError).toHaveBeenCalledTimes(0);
	});

});

describe('downloadSlide', () => {

	const mockCanvas = (window, toDataUrlReturn) => {
		window.HTMLCanvasElement.prototype.getContext = function () {
			return {
				fillRect() { },
				clearRect() { },
				getImageData(x, y, w, h) {
					return {
						data: new Array(w * h * 4)
					};
				},
				putImageData() { },
				createImageData() { return []; },
				setTransform() { },
				drawImage() { },
				save() { },
				fillText() { },
				restore() { },
				beginPath() { },
				moveTo() { },
				lineTo() { },
				closePath() { },
				stroke() { },
				translate() { },
				scale() { },
				rotate() { },
				arc() { },
				fill() { },
				measureText() {
					return { width: 0 };
				},
				transform() { },
				rect() { },
				clip() { },
			};
		}

		window.HTMLCanvasElement.prototype.toDataURL = function () {
			return toDataUrlReturn;
		}

		window.HTMLCanvasElement.prototype.msToBlob = function () {
			return toDataUrlReturn;
		}
	};

	beforeEach(() => {
		document.body.innerHTML =
			'<a id="download" download={downloadFileName}><FontAwesomeIcon icon={faDownload} size="2x" className="clickable"/></a>' +
			'<div class="openseadragon"><div class="openseadragon-canvas">' +
			'<canvas id="myCanvas" width="500" height="500"></canvas>' +
			'</div></div><div class="openseadragon">second one for navigator pane</div>';
		const window = document.defaultView;

	});

	it('sets the href and download attributes on the a tag with "stuff" in non-IE browser', () => {
		mockCanvas(window, 'stuff');
		var canvas = document.getElementById('myCanvas');
		var context = canvas.getContext('2d');

		downloadSlide('slideName');

		let result = document.getElementById('download');
		expect(result.href).toEqual('http://localhost/stuff');
		expect(result.download).toEqual('slideName');
	});

	it('uses msSaveOrOpenBlob in IE browser', () => {
		navigator.__defineGetter__('userAgent', function () {
			return 'MSIE';
		});
		let ieSave = jest.fn();
		window.navigator.msSaveBlob = ieSave;
		mockCanvas(window, 'stuff');
		var canvas = document.getElementById('myCanvas');
		var context = canvas.getContext('2d');

		downloadSlide('slideName');

		expect(ieSave).toHaveBeenCalledTimes(1);
		var blob = canvas.msToBlob();
		expect(ieSave).toHaveBeenCalledWith(blob, 'slideName');
	});
});



let slides = [
	{ id: 1234 },
	{ id: 4321 }
];

describe('getNextSlide', () => {
	it('returns the next slide', () => {
		let thisSlide = { id: 1234 };
		let nextSlide = getNextSlide(slides, thisSlide);
		expect(nextSlide).toEqual({ id: 4321 });
	});
	it('returns the first if it is the last slide', () => {
		let thisSlide = { id: 4321 };
		let nextSlide = getNextSlide(slides, thisSlide);
		expect(nextSlide).toEqual({ id: 1234 });
	});
	it('returns the same slide if it cannot find the slide', () => {
		let thisSlide = { id: 1234567 };
		let nextSlide = getNextSlide(slides, thisSlide);
		expect(nextSlide).toEqual({ id: 1234567 });
	});
});

describe('getPreviousSlide', () => {
	it('returns the last slide if it is the first slide', () => {
		let thisSlide = { id: 1234 };
		let prevSlide = getPreviousSlide(slides, thisSlide);
		expect(prevSlide).toEqual({ id: 4321 });
	});
	it('returns the previous slide', () => {
		let thisSlide = { id: 4321 };
		let prevSlide = getPreviousSlide(slides, thisSlide);
		expect(prevSlide).toEqual({ id: 1234 });
	});
	it('returns the same slide if it cannot find the slide', () => {
		let thisSlide = { id: 1234567 };
		let prevSlide = getNextSlide(slides, thisSlide);
		expect(prevSlide).toEqual({ id: 1234567 });
	});
});

describe('getStainImageName', () => {
	it('returns the stain image name when provided with slide has valid stain', () => {
		let thisSlide = {
			id: 1234,
			stain: { type: 'ihc' }
		};
		let slideImageName = getStainImageName(thisSlide.stain.type);
		expect(slideImageName).toEqual('ihc');
	});
	it('returns the stain image name of "other" when stain type exists but does not have a corresponding image', () => {
		let thisSlide = {
			id: 1234,
			stain: { type: 'foo' }
		};
		let slideImageName = getStainImageName(thisSlide.stain.type);
		expect(slideImageName).toEqual('other');
	});
	it('returns the stain image name of "unknown" when empty string provided', () => {
		let thisSlide = {
			id: 1234,
			stain: { type: '' }
		};
		let slideImageName = getStainImageName(thisSlide.stain.type);
		expect(slideImageName).toEqual('unknown');
	});
	it('returns the stain image name of "unknown" when undefined provided', () => {
		let thisSlide = {
			id: 1234,
			stain: {}
		};
		let slideImageName = getStainImageName(thisSlide.stain.type);
		expect(slideImageName).toEqual('unknown');
	});
});

describe('getNextLetterInAlphabet', () => {
	
	it('should return the next letter', () => {
		let result = getNextLetterInAlphabet('A');
		expect(result).toEqual('B');
	});
	it('should return double first letter when given last letter', () => {
		let result = getNextLetterInAlphabet('Z');
		expect(result).toEqual('AA');
	});
});
