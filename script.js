var croppr = new Croppr('#croppr', {
    onCropEnd: function(value) {
        console.log(value.x, value.y, value.width, value.height);
        
      }
  });
 
 
 const inputs = document.querySelectorAll('.controls input');
 const imgUrl = document.getElementById('photo-link');
 const imageInput = document.getElementById('file');
//  const image = document.querySelector('.image');
 const image = document.querySelector('.croppr-imageClipped');
 const layer = document.querySelector('.layer');
 const originWidth = getComputedStyle(image).getPropertyValue('width');
 const downloadButton = document.getElementById('btn-download');


// document.getElementById('croppr').classList.add('image');

 const ValueTextUpdate = (elementName, newValue) => {
    let valuePara = document.getElementById(`${elementName}-value`);
    if (valuePara !== null) {
    valuePara.innerHTML = newValue;
    }
 }


//after loading page set proper width depending of screen size
 (function () {
    document.querySelector('#width').value = originWidth.slice(0, -2);
    ValueTextUpdate('width', originWidth);
 })();


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
                image.src = event.target.result;
             })
             reset();
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
     let filters = getComputedStyle(image).getPropertyValue('filter');
  
 }

 inputs.forEach(element => {
     element.addEventListener('change', inputUpdate);
 });





    downloadButton.addEventListener('click', ()=>  {

    
     let filters = getComputedStyle(image).getPropertyValue('filter');
    //  let clip = getComputedStyle(image).getPropertyValue('clip-path');
     let mode = getComputedStyle(layer).getPropertyValue('mix-blend-mode');
     let overlayOpacity = getComputedStyle(layer).getPropertyValue('filter');
    let overlayColor = getComputedStyle(layer).getPropertyValue('background-color');


    let gradientColor1 = document.getElementById('gradient-color1').value;
    let gradientColor2 = document.getElementById('gradient-color2').value;
    let gradientStop1 = document.getElementById('color1-percent').value / 100;
    let gradientStop2 = document.getElementById('color2-percent').value / 100;

     var c = document.createElement('canvas');
     var ctx = c.getContext('2d');
     c.width = image.width;
     c.height = image.height;
     var width = image.width;
     var height = image.height;
     console.log(width);
     console.log(height);
     ctx.filter = filters;
     ctx.width = image.width;
     ctx.height = image.height;

    //  clip = clip.match(/\d+/g).map(Number);

    let clip = getComputedStyle(image).getPropertyValue('clip');
    clip = clip.match(/\d+/g).map(Number);
    console.log(clip);
    console.log(width);
    console.log(height);
        let top = clip[0];
        let right = width - clip[1];
        let bottom = height - clip[2];
        let left = clip[3];

    //  let [top, right, bottom, left] = clip;
     clip.length = 4;

     console.log(top);
     console.log(right);
     console.log(left);

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

     console.log(clip);
     console.log(image.naturalWidth);

     let leftIm = image.naturalWidth * left / width;
     let rightIm = image.naturalWidth * right / width;
     let topIm = image.naturalHeight * top / height;
     let bottomIm = image.naturalHeight * bottom / height;
     let newWidth = width - (right + left);
     let newHeight = height - (top + bottom);
     let degs = getComputedStyle(document.documentElement).getPropertyValue('--rotateL');

     if (degs.startsWith('-')) {
         degs = Number(degs.match(/\d/g).join("")) * -1;

     } else {
         degs = Number(degs.match(/\d/g).join(""));
     }

     let newRight = image.naturalWidth - leftIm - rightIm;
     let newBott = image.naturalHeight - topIm - bottomIm;
     ctx.filter = filters;
     console.log(filters);
     let gradientDirection = document.getElementById('gradient-direction').value;
     let gradient;
     console.log(gradientDirection);
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
         c.width = image.width * 2;
         c.height = image.height * 2;
         let radians = Math.PI / 180;
         let x = newWidth / 2;
         let y = newHeight / 2;
         ctx.translate(c.width / 2, c.height / 2);
         ctx.rotate(degs * radians);
         ctx.filter = filters;  
         ctx.drawImage(image, leftIm, topIm, newRight, newBott, (-x), (-y), (newWidth), (newHeight));
         fillOverlay(-x, -y);
         ctx.fillRect(-x, -y, newWidth, newHeight)

     } else {
         c.width = newWidth;
         c.height = newHeight;  
         console.log(newHeight);
         console.log(newWidth);
         ctx.filter = filters;     
         ctx.drawImage(image, leftIm, topIm, newRight, newBott, 0, 0, newWidth, newHeight);
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
console.log(imgUrl.value);
if(imgUrl.value == '')  {
    return 
} else {
     image.src = imgUrl.value;
}

     
 })






  function changeOverlay(event) {
    var overlayOptions = document.querySelector('.overlay-options');
    let element = event.target;
    let elementName = element.getAttribute('id');
    let newValue = element[element.selectedIndex].value;
    document.documentElement.style.setProperty(`--${elementName}`, newValue);
}

document.getElementById('mode').addEventListener('change', changeOverlay);

document.getElementById('gradient-direction').addEventListener('change', changeOverlay);

document.getElementById('solid-bcg').addEventListener('click', (event)=> {
    document.querySelector('.overlay-controls').classList.remove('disabled');  
    layer.classList.remove('gradient-bcg');
    layer.classList.add('solid-bcg');
    document.querySelector('.gradient-colors').classList.add('disabled');
    document.querySelector('.overlay-color').classList.remove('disabled');

})

document.getElementById('gradient-bcg').addEventListener('click', (event)=> {
    document.querySelector('.overlay-controls').classList.remove('disabled');   
    layer.classList.remove('solid-bcg');
    layer.classList.add('gradient-bcg');
    document.querySelector('.overlay-color').classList.add('disabled');
    document.querySelector('.gradient-colors').classList.remove('disabled');
})

document.getElementById('none-bcg').addEventListener('click', (event)=> {
    const layer = document.querySelector('.layer');
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

let background = getComputedStyle(document.querySelector('.layer')).getPropertyValue('background');
if(document.getElementById('gradient-bcg').checked) {
    background = background.split(' ').slice(4, -8).join('');
} else {
    background = background.split(' ').slice(0, -9).join('');
}

let filters = getComputedStyle(document.querySelector('.image')).getPropertyValue('filter');
filters = filters.split(' ').filter(e =>  !e.includes('(0)')  && !e.includes('0deg') && !e.includes('0px') && !e.includes('saturate(1)') && !e.includes('brightness(1)') && !e.includes('contrast(1)') && !e.includes('opacity(1)')).join(' ');

let mode = getComputedStyle(document.querySelector('.layer')).getPropertyValue('mix-blend-mode');
let layerFilter = getComputedStyle(document.querySelector('.layer')).getPropertyValue('filter');
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



  var value = croppr.getValue();

document.querySelector('.cropButton').addEventListener('click', ()=> {
    // document.documentElement.style.setProperty(`--top`, '80px');
    // const b= getComputedStyle(document.querySelector('.croppr-imageClipped')).getPropertyValue('clip');
    // console.log(b);
    // document.querySelector('.croppr-image').style.clip = b;
    document.querySelector('.croppr-region').classList.toggle('disabled');
    // document.querySelectorAll('.croppr-handleContainer > div').forEach(el => {
    //     el.classList.toggle('disabled');
    // })

    document.querySelector('.croppr-handleContainer').classList.toggle('disabled');
   
})

