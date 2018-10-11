//init croppr plugin

let croppr = new Croppr('#croppr', {
    onCropEnd: function (value) {
        console.log(value.x, value.y, value.width, value.height);

    }
});

let value = croppr.getValue();
const inputs = document.querySelectorAll('.controls input');
const imgUrl = document.getElementById('photo-link');
const imageInput = document.getElementById('file');
const clippedImage = document.querySelector('.croppr-imageClipped');
const originImage = document.querySelector('.croppr-image');
const layer = document.querySelector('.layer');
const originWidth = getComputedStyle(clippedImage).getPropertyValue('width');
const downloadButton = document.getElementById('btn-download');
const croppedRegion = document.querySelector('.croppr-region');
const croppedOverlay = document.querySelector('.croppr-overlay');
const croppedHandleContainer = document.querySelector('.croppr-handleContainer');
const croppingButton = document.querySelector('.cropButton');
const showCode = document.querySelector('[href="#css-code"]');
const resetButton = document.querySelector('.reset');



const ValueTextUpdate = (elementName, newValue) => {
    let valuePara = document.getElementById(`${elementName}-value`);
    if (valuePara !== null) {
        valuePara.innerHTML = newValue;
    }
}

const setCropHandlesPosition = () => {
    document.querySelector('.croppr-handle').style.transform = `translate(-5px, -5px)`;
    document.querySelector('.croppr-handle:nth-child(2)').style.transform = `translate(${clippedImage.clientWidth/2}px, -5px)`;
    document.querySelector('.croppr-handle:nth-child(3)').style.transform = `translate(${clippedImage.clientWidth - 5}px, -5px)`;
    document.querySelector('.croppr-handle:nth-child(4)').style.transform = `translate(${clippedImage.clientWidth - 5}px, ${clippedImage.clientHeight/2}px)`;
    document.querySelector('.croppr-handle:nth-child(5)').style.transform = `translate(${clippedImage.clientWidth - 5}px, ${clippedImage.clientHeight - 5}px)`;
    document.querySelector('.croppr-handle:nth-child(6)').style.transform = `translate(${clippedImage.clientWidth/2}px, ${clippedImage.clientHeight - 5}px)`;
    document.querySelector('.croppr-handle:nth-child(7)').style.transform = `translate(-5px, ${clippedImage.clientHeight - 5}px)`;
    document.querySelector('.croppr-handle:nth-child(8)').style.transform = `translate(-5px, ${clippedImage.clientHeight/2 - 5}px)`;
}


//after loading page set proper width in input depending of screen size and set position of crop handles
(function () {
    document.querySelector('#width').value = originWidth.slice(0, -2);
    ValueTextUpdate('width', originWidth);
    setCropHandlesPosition();
})();


const updateDimensions = () => {
    clippedImage.style.clip = `rect(0px, ${clippedImage.clientWidth}px, ${clippedImage.clientHeight}px, 0px`;
    layer.style.clip = `rect(0px, ${clippedImage.clientWidth}px, ${clippedImage.clientHeight}px, 0px`;
    croppedRegion.style.width = `${clippedImage.clientWidth}px`;
    croppedRegion.style.height = `${clippedImage.clientHeight}px`;
    croppedRegion.style.transform = `translate(0px, 0px)`;
}

const reset = () => {
    document.getElementById('controls').reset();
    document.querySelectorAll('.basic-controls input').forEach(el => {
        let resetValue = `0${el.dataset.sizing}`;
        if (el.name == 'width') {
            document.documentElement.style.setProperty(`--${el.name}`, originWidth);
            ValueTextUpdate(el.name, originWidth);
        } else if (el.name == 'saturate' || el.name == 'opacity' || el.name == 'brightness' || el.name == 'contrast') {
            document.documentElement.style.setProperty(`--${el.name}`, '100%');
            ValueTextUpdate(el.name, '100%');
        } else {
            document.documentElement.style.setProperty(`--${el.name}`, resetValue);
            ValueTextUpdate(el.name, resetValue);
        }
    });

    updateDimensions();
    originImage.classList.add('invisible');
    croppedOverlay.classList.add('invisible');
    croppedHandleContainer.classList.add('disabled');
    croppedRegion.classList.add('disabled');
    setCropHandlesPosition();
}

const changeOverlay = (event) => {
    let overlayOptions = document.querySelector('.overlay-options');
    let element = event.target;
    let elementName = element.getAttribute('id');
    let newValue = element[element.selectedIndex].value;
    document.documentElement.style.setProperty(`--${elementName}`, newValue);
}


const inputUpdate = (event, input) => {
    let element;
    if (event == undefined) {
        element = input;
    } else {
        element = event.target;
    }
    const suffix = element.dataset.sizing || '';
    let elementName = element.name;
    let newValue = element.value + suffix;
    ValueTextUpdate(elementName, newValue);
    document.documentElement.style.setProperty(`--${elementName}`, newValue);
    let filters = getComputedStyle(clippedImage).getPropertyValue('filter');
    if (elementName == 'width') {
        updateDimensions();
        setCropHandlesPosition();
    }
}

const createCanvas = () => {
    let filters = getComputedStyle(clippedImage).getPropertyValue('filter');
    let mode = getComputedStyle(layer).getPropertyValue('mix-blend-mode');
    let overlayOpacity = getComputedStyle(layer).getPropertyValue('filter');
    let overlayColor = getComputedStyle(layer).getPropertyValue('background-color');
    let gradientColor1 = document.getElementById('gradient-color1').value;
    let gradientColor2 = document.getElementById('gradient-color2').value;
    let gradientStop1 = document.getElementById('color1-percent').value / 100;
    let gradientStop2 = document.getElementById('color2-percent').value / 100;

    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let width = clippedImage.width;
    let height = clippedImage.height;

    [canvas, ctx].forEach(el => {
        el.width = width;
        el.height = height;
    })

    let clip = getComputedStyle(clippedImage).getPropertyValue('clip').match(/\d+/g).map(Number);
    let topClip = clip[0] || 0;
    let rightClip = width - clip[1] || 0;
    let bottomClip = height - clip[2] || 0;;
    let leftClip = clip[3] || 0;
    clip.length = 4;

    let leftIm = clippedImage.naturalWidth * leftClip / width;
    let rightIm = clippedImage.naturalWidth * rightClip / width;
    let topIm = clippedImage.naturalHeight * topClip / height;
    let bottomIm = clippedImage.naturalHeight * bottomClip / height;
    let newWidth = width - (rightClip + leftClip);
    let newHeight = height - (topClip + bottomClip);
    let newRight = clippedImage.naturalWidth - leftIm - rightIm;
    let newBottom = clippedImage.naturalHeight - topIm - bottomIm;

    let gradientDirection = document.getElementById('gradient-direction').value;
    let gradient;

    const fillOverlay = (x, y) => {
        if (document.getElementById('gradient-bcg').checked) {
            switch (gradientDirection) {
                case 'to right':
                    gradient = ctx.createLinearGradient(x, y, newWidth, y);
                    break;
                case 'to left':
                    gradient = ctx.createLinearGradient(newWidth, y, x, y);
                    break;
                case 'to bottom':
                    gradient = ctx.createLinearGradient(x, y, x, newHeight);
                    break;
                case 'to top':
                    gradient = ctx.createLinearGradient(x, newHeight, x, y);
                    break;
                case 'to bottom right':
                    gradient = ctx.createLinearGradient(x, y, newWidth, newHeight);
                    break;
                case 'to bottom left':
                    gradient = ctx.createLinearGradient(newWidth, y, x, newHeight);
                    break;
                case 'to top right':
                    gradient = ctx.createLinearGradient(x, newHeight, newWidth, y);
                    break;
                case 'to top left':
                    gradient = ctx.createLinearGradient(newWidth, newHeight, x, y);
                    break;
            }
            gradient.addColorStop(gradientStop1, gradientColor1);
            gradient.addColorStop(gradientStop2, gradientColor2);

        } else if (document.getElementById('solid-bcg').checked) {
            gradient = overlayColor;
        } else if (document.getElementById('none-bcg').checked) {
            gradient = 'transparent';
        }

        ctx.fillStyle = gradient;
        ctx.globalCompositeOperation = mode;
        ctx.filter = overlayOpacity;
    }

    let degs = getComputedStyle(document.documentElement).getPropertyValue('--rotateL');

    if (degs.startsWith('-')) {
        degs = Number(degs.match(/\d/g).join("")) * -1;

    } else {
        degs = Number(degs.match(/\d/g).join(""));
    }


    if (degs !== 0) {
        canvas.width = clippedImage.width * 2;
        canvas.height = clippedImage.height * 2;
        let radians = Math.PI / 180;
        let x = newWidth / 2;
        let y = newHeight / 2;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(degs * radians);
        ctx.filter = filters;
        ctx.drawImage(clippedImage, leftIm, topIm, newRight, newBottom, (-x), (-y), (newWidth), (newHeight));
        fillOverlay(-x, -y);
        ctx.fillRect(-x, -y, newWidth, newHeight)
    } else {
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.filter = filters;
        ctx.drawImage(clippedImage, leftIm, topIm, newRight, newBottom, 0, 0, newWidth, newHeight);
        fillOverlay(0, 0);
        ctx.fillRect(0, 0, newWidth, newHeight)
    }

    return canvas;
}

const downloadImage = () => {
    let link = document.createElement('a');
    let url = createCanvas().toDataURL();
    link.href = url;
    link.download = "myphoto.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


const changeBackground = (active, inactive, activeColors, inactiveColors) => {
    document.querySelector('.overlay-controls').classList.remove('disabled');
    layer.classList.remove(inactive);
    layer.classList.add(active);
    document.querySelector(inactiveColors).classList.add('disabled');
    document.querySelector(activeColors).classList.remove('disabled');
}


const showCSSCode = () => {

    let background = getComputedStyle(layer).getPropertyValue('background');
    if (document.getElementById('gradient-bcg').checked) {
        background = background.split(' ').slice(4, -8).join('');
    } else {
        background = background.split(' ').slice(0, -9).join('');
    }

    let filters = getComputedStyle(clippedImage).getPropertyValue('filter');
    filters = filters.split(' ').filter(e => !e.includes('(0)') && !e.includes('0deg') && !e.includes('0px') && !e.includes('saturate(1)') && !e.includes('brightness(1)') && !e.includes('contrast(1)') && !e.includes('opacity(1)')).join(' ');

    let mode = getComputedStyle(layer).getPropertyValue('mix-blend-mode');
    let layerFilter = getComputedStyle(layer).getPropertyValue('filter');
    let filterProperty = filters == [] ? "" : `
filter: ${filters};`
    let overlay = `
  .filter::before { <span class="pre-code">
    content: "";
    display: block;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    position: absolute;
    mix-blend-mode: ${mode};
    filter: ${layerFilter};
    background: ${background};</span>
  }`
    document.querySelector('.code-container').innerHTML = `
<pre>
.filter { <span class="pre-code">
    position: relative; ${filterProperty} </span>  
}
  ${document.getElementById('none-bcg').checked?'':overlay}
 </pre>
`
}


const turnOnCropping = () => {
    croppedRegion.classList.toggle('disabled');
    originImage.classList.toggle('invisible');
    croppedOverlay.classList.toggle('invisible');
    croppedHandleContainer.classList.toggle('disabled');
}

const loadURLImage = () => {
    if (imgUrl.value == '') {
        return
    } else {
        clippedImage.src = imgUrl.value;
        originImage.src = imgUrl.value;
        clippedImage.addEventListener('load', () => {
            reset();
        })
    }
}

const changeColorPercent = () => {
    let oldValue = event.target.parentNode.firstElementChild.value;
    let input = event.target.parentNode.firstElementChild;
    let newValue = 0;
    if (event.target.innerHTML == '+') {
        newValue = parseFloat(oldValue) + 1;
    } else {
        if (oldValue > 0) {
            newValue = parseFloat(oldValue) - 1
        } else {
            newValue = 0;
        }
    }
    event.target.parentNode.firstElementChild.value = newValue;
    inputUpdate(undefined, input)
}

inputs.forEach(element => {
    element.addEventListener('change', inputUpdate);
});


imageInput.addEventListener('change', (event) => {
    let files = event.target.files;
    if (window.File && window.FileReader) {
        let url = event.target.value;
        let ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
        let selectedFile = imageInput.files[0];;
        if (selectedFile && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
            let reader = new FileReader();
            reader.addEventListener('load', (event) => {
                clippedImage.src = event.target.result;
                originImage.src = event.target.result;
                clippedImage.addEventListener('load', () => {
                    reset();
                })
            })
            reader.readAsDataURL(selectedFile);
        } else {
            alert("Bad extension of file")
        }
    } else {
        alert("The File APIs are not fully supported in this browser.")
    }
})


document.getElementById('mode').addEventListener('change', changeOverlay);

document.getElementById('gradient-direction').addEventListener('change', changeOverlay);

document.addEventListener('click', (event) => {
    if (event.target.matches('.photo-link-label')) {
        document.querySelector('.photo-link-container').classList.add('active');
    } else if (event.target.matches('.link-icon')) {
        loadURLImage();
    } else if (event.target.closest('.photo-link-container') || event.target.closest('.photo-link-label')) {
        return;
    } else {
        document.querySelector('.photo-link-container').classList.remove('active');
    }
    if (event.target == resetButton) reset();

    if (event.target == downloadButton) downloadImage();

    if (event.target == showCode) showCSSCode();

    if (event.target == croppingButton) turnOnCropping();

    if (event.target.matches('#solid-bcg')) changeBackground('solid-bcg', 'gradient-bcg', '.overlay-color', '.gradient-colors');

    if (event.target.matches('#gradient-bcg')) changeBackground('gradient-bcg', 'solid-bcg', '.gradient-colors', '.overlay-color');

    if (event.target.matches('#none-bcg')) {
        layer.classList.remove('solid-bcg', 'gradient-bcg');
        document.querySelector('.overlay-controls').classList.add('disabled');
    };

    if (event.target.matches('.percent-color-button')) changeColorPercent();
})



//init materialize tabs and select inputs

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);

});

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.tabs');
    var instance = M.Tabs.init(elems);
});