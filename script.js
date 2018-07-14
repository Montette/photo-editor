
//init croppr plugin

var croppr = new Croppr('#croppr', {
    onCropEnd: function(value) {
        console.log(value.x, value.y, value.width, value.height);
        
      }
  });

  var value = croppr.getValue();
 
 
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



 const updateDimensions = ()=> {
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
        if(el.name == 'width') {
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


 imageInput.addEventListener('change', (event) => {
     var files = event.target.files;
     if (window.File && window.FileReader) {
         let url = event.target.value;
         let ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
         let selectedFile = imageInput.files[0];;
         if (selectedFile && (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
             let reader = new FileReader();
             reader.addEventListener('load', (event) => {
                clippedImage.src = event.target.result;
                originImage.src = event.target.result;
                clippedImage.addEventListener('load', ()=> {
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
     if(elementName == 'width') {
        updateDimensions();
        setCropHandlesPosition();
     }
 }


 inputs.forEach(element => {
     element.addEventListener('change', inputUpdate);
 });





    downloadButton.addEventListener('click', ()=>  {

    
     let filters = getComputedStyle(clippedImage).getPropertyValue('filter');
     let mode = getComputedStyle(layer).getPropertyValue('mix-blend-mode');
     let overlayOpacity = getComputedStyle(layer).getPropertyValue('filter');
    let overlayColor = getComputedStyle(layer).getPropertyValue('background-color');
    let gradientColor1 = document.getElementById('gradient-color1').value;
    let gradientColor2 = document.getElementById('gradient-color2').value;
    let gradientStop1 = document.getElementById('color1-percent').value / 100;
    let gradientStop2 = document.getElementById('color2-percent').value / 100;

     let c = document.createElement('canvas');
     let ctx = c.getContext('2d');
     c.width = clippedImage.width;
     c.height = clippedImage.height;
     let width = clippedImage.width;
     let height = clippedImage.height;
     ctx.filter = filters;
     ctx.width = clippedImage.width;
     ctx.height = clippedImage.height;

    let clip = getComputedStyle(clippedImage).getPropertyValue('clip');
    clip = clip.match(/\d+/g).map(Number);
        let top = clip[0];
        let right = width - clip[1];
        let bottom = height - clip[2];
        let left = clip[3];
     clip.length = 4;

     if (top == undefined) {
         top = 0;
     }
     if (right == undefined) {
         right = 0;
     }
     if (bottom == undefined) {
         bottom = 0;
     }
     if (left == undefined) {
         left = 0;
     }


     let leftIm = clippedImage.naturalWidth * left / width;
     let rightIm = clippedImage.naturalWidth * right / width;
     let topIm = clippedImage.naturalHeight * top / height;
     let bottomIm = clippedImage.naturalHeight * bottom / height;
     let newWidth = width - (right + left);
     let newHeight = height - (top + bottom);
     let degs = getComputedStyle(document.documentElement).getPropertyValue('--rotateL');

     if (degs.startsWith('-')) {
         degs = Number(degs.match(/\d/g).join("")) * -1;

     } else {
         degs = Number(degs.match(/\d/g).join(""));
     }

     let newRight = clippedImage.naturalWidth - leftIm - rightIm;
     let newBott = clippedImage.naturalHeight - topIm - bottomIm;
     ctx.filter = filters;
     let gradientDirection = document.getElementById('gradient-direction').value;
     let gradient;
    const fillOverlay = (x,y)=> {

    if (document.getElementById('gradient-bcg').checked) {

     switch(gradientDirection) {
         case 'to right':
            gradient =  ctx.createLinearGradient(x, y, newWidth, y);
            break;
         case 'to left':
            gradient =  ctx.createLinearGradient(newWidth, y, x, y);
            break;
        case 'to bottom':
            gradient =  ctx.createLinearGradient(x, y, x, newHeight);
            break;
        case 'to top':
            gradient =  ctx.createLinearGradient(x, newHeight, x, y);
            break;
        case 'to bottom right':
            gradient =  ctx.createLinearGradient(x, y, newWidth, newHeight);
            break;
        case 'to bottom left':
            gradient =  ctx.createLinearGradient(newWidth, y, x, newHeight);
            break;
        case 'to top right':
            gradient =  ctx.createLinearGradient(x, newHeight, newWidth, y);
            break;
        case 'to top left':
            gradient =  ctx.createLinearGradient(newWidth, newHeight, x, y);
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

     if (degs !== 0) {
         c.width = clippedImage.width * 2;
         c.height = clippedImage.height * 2;
         let radians = Math.PI / 180;
         let x = newWidth / 2;
         let y = newHeight / 2;
         ctx.translate(c.width / 2, c.height / 2);
         ctx.rotate(degs * radians);
         ctx.filter = filters;  
         ctx.drawImage(clippedImage, leftIm, topIm, newRight, newBott, (-x), (-y), (newWidth), (newHeight));
         fillOverlay(-x, -y);
         ctx.fillRect(-x, -y, newWidth, newHeight)
     } else {
         c.width = newWidth;
         c.height = newHeight;  
         console.log(newHeight);
         console.log(newWidth);
         ctx.filter = filters;     
         ctx.drawImage(clippedImage, leftIm, topIm, newRight, newBott, 0, 0, newWidth, newHeight);
        fillOverlay(0,0);
        ctx.fillRect(0, 0, newWidth, newHeight)
     }

    let link = document.createElement('a');
    let url = c.toDataURL();
    link.href = url;
    link.download = "myphoto.png";
     document.body.appendChild(link);
       link.click();
     document.body.removeChild(link);

});




 document.querySelector('.reset').addEventListener('click', reset);
 
document.querySelector('.photo-link-label').addEventListener('click', ()=> {
    document.querySelector('.photo-link-container').classList.add('active');
})

document.addEventListener('click', ()=> {
    if(event.target.closest('.photo-link-container') || event.target.closest('.photo-link-label')) return;
    document.querySelector('.photo-link-container').classList.remove('active');
})

 document.querySelector('.photo-link__button').addEventListener('click', () => {

    reset();
if(imgUrl.value == '')  {
    return 
} else {
    clippedImage.src = imgUrl.value;
}

     
 })








document.getElementById('mode').addEventListener('change', changeOverlay);

document.getElementById('gradient-direction').addEventListener('change', changeOverlay);




const changeBackground = (active, inactive, activeColors, inactiveColors)=> {
    document.querySelector('.overlay-controls').classList.remove('disabled');  
    layer.classList.remove(inactive);
    layer.classList.add(active);
    document.querySelector(inactiveColors).classList.add('disabled');
    document.querySelector(activeColors).classList.remove('disabled');
}

// document.getElementById('solid-bcg').addEventListener('click', (event)=> {
//     document.querySelector('.overlay-controls').classList.remove('disabled');  
//     layer.classList.remove('gradient-bcg');
//     layer.classList.add('solid-bcg');
//     document.querySelector('.gradient-colors').classList.add('disabled');
//     document.querySelector('.overlay-color').classList.remove('disabled');

// })

document.getElementById('solid-bcg').addEventListener('click', () => {
    changeBackground('solid-bcg', 'gradient-bcg', '.overlay-color', '.gradient-colors')
});
document.getElementById('gradient-bcg').addEventListener('click', () => {
    changeBackground('gradient-bcg', 'solid-bcg','.gradient-colors', '.overlay-color')
});

// document.getElementById('gradient-bcg').addEventListener('click', (event)=> {
//     document.querySelector('.overlay-controls').classList.remove('disabled');   
//     layer.classList.remove('solid-bcg');
//     layer.classList.add('gradient-bcg');
//     document.querySelector('.overlay-color').classList.add('disabled');
//     document.querySelector('.gradient-colors').classList.remove('disabled');
// })

document.getElementById('none-bcg').addEventListener('click', (event)=> {
    
    layer.classList.remove('solid-bcg', 'gradient-bcg');   
    document.querySelector('.overlay-controls').classList.add('disabled');  
})

document.querySelectorAll('.percent-color-button').forEach(button => {
    button.addEventListener('click', event => {  
        let oldValue = event.target.parentNode.firstElementChild.value;
        let input = event.target.parentNode.firstElementChild;
        let newValue = 0;
        if(event.target.innerHTML == '+') {      
             newValue = parseFloat(oldValue) + 1;
        } else {
            if(oldValue > 0) {
                 newValue = parseFloat(oldValue) - 1
            } else {
                newValue = 0;
            }
        }
        event.target.parentNode.firstElementChild.value = newValue;
        inputUpdate(undefined, input)
    })
})


document.querySelector('[href="#css-code"]').addEventListener('click', ()=> {

let background = getComputedStyle(layer).getPropertyValue('background');
if(document.getElementById('gradient-bcg').checked) {
    background = background.split(' ').slice(4, -8).join('');
} else {
    background = background.split(' ').slice(0, -9).join('');
}

let filters = getComputedStyle(clippedImage).getPropertyValue('filter');
filters = filters.split(' ').filter(e =>  !e.includes('(0)')  && !e.includes('0deg') && !e.includes('0px') && !e.includes('saturate(1)') && !e.includes('brightness(1)') && !e.includes('contrast(1)') && !e.includes('opacity(1)')).join(' ');

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
    document.querySelector('.code-container').innerHTML=`
<pre>
.filter { <span class="pre-code">
    position: relative; ${filterProperty} </span>  
}
  ${document.getElementById('none-bcg').checked?'':overlay}
 </pre>
`
})



//init materialize tabs and select inputs

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
  
  });

 document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.tabs');
    var instance = M.Tabs.init(elems);
  });



 

croppingButton.addEventListener('click', ()=> {
   

    croppedRegion.classList.toggle('disabled');
    originImage.classList.toggle('invisible');
    croppedOverlay.classList.toggle('invisible');
    croppedHandleContainer.classList.toggle('disabled');
   

   
})

