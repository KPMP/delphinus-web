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
    let numberOfLabels = 0
    let vertical = verticalGridSize / parseFloat(metadata.openSlide.mpp_y);

    if (metadata.aperio.originalWidth && metadata.aperio.originalWidth) {
        let width = parseInt(metadata.aperio.originalWidth);
        let height = parseInt(metadata.aperio.originalHeight);
        for (let yy = 0; yy < (height - (vertical * 4)); yy += vertical) {
            for (let ii = 0; ii < (width - (vertical * 4)); ii += vertical) {
                numberOfLabels += 1;
            }
        }
        if (numberOfLabels > 620) {
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