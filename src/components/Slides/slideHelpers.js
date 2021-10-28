export const downloadSlide = (downloadFileName) => {
    let openseadragon = document.getElementsByClassName("openseadragon")[0];
    let canvasDiv = openseadragon.getElementsByClassName("openseadragon-canvas")[0];
    let canvas = canvasDiv.getElementsByTagName("canvas")[0];

    var isIE = !!navigator.userAgent.match(/Trident/g) || !!navigator.userAgent.match(/MSIE/g);
    if (!isIE) {
        let image = canvas.toDataURL("image/jpeg");
        let downloadLink = document.getElementById("download");
        downloadLink.setAttribute("download", downloadFileName);
        downloadLink.setAttribute("href", image);


        // For some reason, we need to click the button again in firefox for the download to happen
        if (navigator.userAgent.match(/Firefox/g)) {
            downloadLink.click();
        }
    }

    if (isIE) {
        var blob = canvas.msToBlob();
        window.navigator.msSaveBlob(blob, downloadFileName);
    }
}

export const printSlide = () => {
    let openseadragon = document.getElementsByClassName("openseadragon")[0];
    let canvasDiv = openseadragon.getElementsByClassName("openseadragon-canvas")[0];
    let canvas = canvasDiv.getElementsByTagName("canvas")[0];

    let image = canvas.toDataURL("image/jpeg");
    let printWindow = window.open('');
    printWindow.document.write('<img src="' + image + '" onload="window.print();window.close()" />');
    printWindow.focus();
}

export const noSlidesFound = (selected, handleError) => {
    if (selected === null || selected === undefined || Object.keys(selected.slides).length === 0) {
        handleError({ error: 'No participant selected. No slides to show.', stackTrace: '' })
    }
}

const getSlideIndex = (slideArray, selectedSlide) => {
    return slideArray.findIndex((slide) => {
        return slide.id === selectedSlide.id;
    }, this);
};

export const getNextSlide = (slideArray, selectedSlide) => {
    let slideIndex = getSlideIndex(slideArray, selectedSlide);
    if (slideIndex === -1) {
        return selectedSlide;
    }
    let nextSlideIndex = slideIndex + 1;
    if (nextSlideIndex === slideArray.length) {
        return slideArray[0];
    }
    else {
        return slideArray[nextSlideIndex];
    }
};

export const getPreviousSlide = (slideArray, selectedSlide) => {
    let slideIndex = getSlideIndex(slideArray, selectedSlide);
    if (slideIndex === -1) {
        return selectedSlide;
    }
    let previousSlideIndex = slideIndex - 1;
    if (previousSlideIndex < 0) {
        return slideArray[slideArray.length - 1];
    }
    else {
        return slideArray[previousSlideIndex];
    }
};

export const getStainImageName = (stainType) => {
    const availableImages = {
        'cr': true,
        'frz': true,
        'he': true,
        'ihc': true,
        'pas': true,
        'silver': true,
        'tol': true,
        'tri': true,
    };

    if (!stainType) {
        return 'unknown';
    } else if (availableImages[stainType.toLowerCase()]) {
        return stainType.toLowerCase();
    } else {
        return 'other';
    }
}

export const determineIfSlideTooLargeForGrid = (metadata, verticalGridSize = 500) => {
    let vertical = verticalGridSize / parseFloat(metadata.openSlide.mpp_y);

    if (metadata.aperio.originalWidth && metadata.aperio.originalWidth) {
        let width = parseInt(metadata.aperio.originalWidth);
        let height = parseInt(metadata.aperio.originalHeight);
        let outerLoopCount = (height - (vertical * 4)) / vertical;
        let innerLoopCount = (width - (vertical * 4)) / vertical;
        let numberOfLabels = Math.ceil(outerLoopCount) * Math.ceil(innerLoopCount);

        if (numberOfLabels > 775) {
            return true;
        } else {
            return false;
        }
    } else {
        console.error('original width or height not available on metadata object')
    }
}

export const determineIfPilotSlide = (participants, selectedParticipant) => {
    const currentParticipant = participants.filter(participant => participant.kpmpId === selectedParticipant.id);
    if (currentParticipant.length > 0 && currentParticipant[0].label.toLowerCase().indexOf('pilot') >= 0) {
        return true;
    } else {
        return false;
    }
}

export const getNextLetterInAlphabet =(currentLetter = '')  => {

        if(currentLetter === "") {
            return "A";
        }
        var prefix = currentLetter.substring(0, currentLetter.length-1);
        var last = currentLetter[currentLetter.length-1]
        if(last === "Z") {
            return (getNextLetterInAlphabet(prefix) + "A");
        }
        return prefix + String.fromCharCode(currentLetter.charCodeAt(currentLetter.length-1) + 1);

}

export const calculateGridLineLength = (imageDimension, lineDimension) => {
    // The choosen micron dimension may not be cleanly devisable by the image dimensions.
    // This function ensures the lines correctly line up during those cases.
    return (Math.ceil(((imageDimension + lineDimension) / lineDimension)) - 1) * lineDimension
}

export const getGridOverlay = (metadata, labelSetId, verticalSize, horizontalSize) => {
    let lineThickness = 13;
		let vertical = verticalSize / parseFloat(metadata.openSlide.mpp_y);
		let horizontal = horizontalSize / parseFloat(metadata.openSlide.mpp_y);
		let overlay = [];
		let overlayLabel = []
		if (metadata && metadata.aperio && metadata.aperio.originalHeight && metadata.aperio.originalWidth) {
			let width = parseInt(metadata.aperio.originalWidth);
			let height = parseInt(metadata.aperio.originalHeight);
            let gridLineLengthForHeight = (Math.ceil(((height + horizontal) / horizontal)) -1 ) * horizontal;
            let gridLineLengthForWidth = (Math.ceil(((width + horizontal) / horizontal)) -1 ) * horizontal;
			for (let i = 0; i < (width + vertical); i += vertical) {
				overlay.push({
					px: i,
					py: 0,
					width: lineThickness,
					height: gridLineLengthForHeight,
					className: 'gridline'
				})
			}

			for (let i = 0; i <= (height + horizontal); i += horizontal) {
				overlay.push({
					px: 0,
					py: i,
					width: gridLineLengthForWidth,
					height: lineThickness,
					className: 'gridline'
				})
			}
			let currentLetter = '';
			let currentNumber = 0;
			for (let yy = 0; yy < (height); yy += vertical) {
				currentLetter = getNextLetterInAlphabet('');
				for (let i = 0; i < (width); i += vertical) {
					overlayLabel.push(`${currentLetter + currentNumber}`)
					overlay.push({
						id: `labelOverlay-${currentLetter + currentNumber}-${labelSetId}`,
						px: 0 + (i / vertical * vertical + lineThickness),
						py: 0 + (yy / horizontal * horizontal + lineThickness),
					})
					currentLetter = getNextLetterInAlphabet(currentLetter);
				}
				currentNumber += 1;
			}

		} else {
			console.error('Metadata not provided with slide')
		}
		return [overlay, overlayLabel];
}
