 const inputs = document.querySelectorAll('.controls input');
 const imgUrl = document.getElementById('photo-link');




 let imageInput = document.getElementById('file');
 let image = document.getElementById('image');
 const layer = document.querySelector('.layer');




 const ValueTextUpdate = (elementName, newValue) => {
    let valuePara = document.getElementById(`${elementName}-value`);
    if (valuePara !== null) {
    valuePara.innerHTML = newValue;
    }
 }


 (function () {
    let width = getComputedStyle(image).getPropertyValue('width');
    console.log(width);
    document.querySelector('#width').value = width.slice(0, -2);
    ValueTextUpdate('width', width);
 })();


 const reset = () => {

document.getElementById('controls').reset();

     document.querySelectorAll('.basic-controls input').forEach(el => {

      let resetValue = `0${el.dataset.sizing}`;

        if(el.name == 'width') {
            document.documentElement.style.setProperty(`--${el.name}`, '600px');
            ValueTextUpdate(el.name, '600px');
        } else if (el.name == 'saturate' || el.name == 'opacity' || el.name == 'brightness' || el.name == 'contrast') {
            document.documentElement.style.setProperty(`--${el.name}`, '100%');
            ValueTextUpdate(el.name, '100%');
        } else {
            document.documentElement.style.setProperty(`--${el.name}`, resetValue);
            ValueTextUpdate(el.name, resetValue);
        }
        //  document.documentElement.style.setProperty(`--${el.name}`, resetValue);
        //  ValueTextUpdate(el.name, resetValue);
    
     });


    //  document.documentElement.style.setProperty('--width', '600px');
    //  document.documentElement.style.setProperty('--saturate', '100%');
    //  document.documentElement.style.setProperty('--opacity', '100%');
    //  document.documentElement.style.setProperty('--brightness', '100%');
    //  document.documentElement.style.setProperty('--contrast', '100%');


    //  document.querySelector('#width').value = 500;
    //  document.querySelector('#saturate').value = 100;
    //  document.querySelector('#opacity').value = 100;
    //  document.querySelector('#brightness').value = 100;
    //  document.querySelector('#contrast').value = 100;
 }


 imageInput.addEventListener('change', (event) => {
     var files = event.target.files;
     console.log("aaa");



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
    //  let valuePara = document.getElementById(`${elementName}-value`);
    //  if (valuePara !== null) {
    //  valuePara.innerHTML = newValue;
    //  }
    ValueTextUpdate(elementName, newValue);
     console.log(newValue);
     document.documentElement.style.setProperty(`--${elementName}`, newValue);

     let filters = getComputedStyle(image).getPropertyValue('filter');
     console.log(filters);


     //   let degs = getComputedStyle(image).getPropertyValue('transform');
     //     degs = degs.match(/\d+/g).map(Number);

     // let degs = getComputedStyle(document.documentElement).getPropertyValue('--rotateL');
     //     console.log(degs);

     //   console.log(image.src);


 }

 inputs.forEach(element => {
     element.addEventListener('change', inputUpdate);
 });







 var button = document.getElementById('btn-download');

//  button.onclick = async () => {

button.addEventListener('click', ()=>  {

    
     let filters = getComputedStyle(image).getPropertyValue('filter');
     let clip = getComputedStyle(image).getPropertyValue('clip-path');
     let mode = getComputedStyle(layer).getPropertyValue('mix-blend-mode');
     let overlayOpacity = getComputedStyle(layer).getPropertyValue('filter');
    //  overlayOpacity = Number(overlayOpacity.match(/\d/g).join(""));
    let overlayColor = getComputedStyle(layer).getPropertyValue('background-color');

    // let gradientEl = document.querySelector('.gradient-bcg');
    // let gradientColor = getComputedStyle(gradientEl).getPropertyValue('background');
    // console.log(gradientColor);

    let gradientColor1 = document.getElementById('gradient-color1').value;
    let gradientColor2 = document.getElementById('gradient-color2').value;
    let gradientStop1 = document.getElementById('color1-percent').value / 100;
    let gradientStop2 = document.getElementById('color2-percent').value / 100;
    console.log(gradientStop1);





     var img = new Image();

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

     var c2 = document.createElement('canvas');
     var ctx2 = c.getContext('2d');
     c2.width = image.width;
     c2.height = image.height;

     clip = clip.match(/\d+/g).map(Number);

     let [top, right, bottom, left] = clip;
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

     console.log(clip);
     console.log(image.naturalWidth);

     let leftIm = image.naturalWidth * left / width;
     let rightIm = image.naturalWidth * right / width;
     let topIm = image.naturalHeight * top / height;
     let bottomIm = image.naturalHeight * bottom / height;

     let newWidth = width - (right + left);
     let newWidth2 = leftIm;
     let newHeight = height - (top + bottom);
     let newHeight2 = bottomIm;

     let degs = getComputedStyle(document.documentElement).getPropertyValue('--rotateL');
     // degs = degs.match(/\d+/g).map(Number)[0];

     if (degs.startsWith('-')) {
         degs = Number(degs.match(/\d/g).join("")) * -1;

     } else {
         degs = Number(degs.match(/\d/g).join(""));
     }







     let newRight = image.naturalWidth - leftIm - rightIm;
     let newBott = image.naturalHeight - topIm - bottomIm;




     // c.width = newWidth;
     // c.height = newHeight;
     ctx.filter = filters;
     // ctx.rotate(1.57);

     let gradientDirection = document.getElementById('gradient-direction').value;
     let gradient;
     console.log(gradientDirection);

    //  if(gradientDirection === 'to right') {
    //   gradient =  ctx.createLinearGradient(0, 0, newWidth, 0);
    //  } else if(gradientDirection === 'to left') {
    //     gradient =  ctx.createLinearGradient(newWidth, 0, 0, 0);
    //  }
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
        //  ctx.clearRect(0, 0, c.width, c.height);
        //  ctx.save();
         ctx.translate(c.width / 2, c.height / 2);
         ctx.rotate(degs * radians);
  
         ctx.filter = filters;
        
         ctx.drawImage(image, leftIm, topIm, newRight, newBott, (-x), (-y), (newWidth), (newHeight));
         fillOverlay(-x, -y);
         ctx.fillRect(-x, -y, newWidth, newHeight)
        //  ctx.restore();

        

         console.log('fff');
     } else {

         c.width = newWidth;
         c.height = newHeight;
   
         ctx.filter = filters;
        
         ctx.drawImage(image, leftIm, topIm, newRight, newBott, 0, 0, newWidth, newHeight);

  
        // const fillOverlay = ()=> {
        //  ctx.fillStyle = gradient;
        //  ctx.globalCompositeOperation = mode;
        // ctx.filter = overlayOpacity; 
        // }

        fillOverlay(0,0);
        ctx.fillRect(0, 0, newWidth, newHeight)
     }

    //  let blob = await new Promise(resolve=>c.toBlob(resolve));
    //  let url = URL.createObjectURL(blob);

     
    //  let a = document.createElement('a');
    //  a.href = url;
    //  a.download = 'myphoto.png';
    //  document.body.appendChild(a);
    //  window.open(url);
    //  a.click();
    //  document.body.removeChild(a);

     var link = document.createElement('a');
    //  link.innerHTML = 'download image';
    //  link.addEventListener('click', function (ev) {
    //      link.href = c.toDataURL();
    //      link.download = "mypainting.png";
    //  }, false);

    let url = c.toDataURL();
    link.href = url;
    // window.open(url);
    link.download = "myphoto.png";
     document.body.appendChild(link);
       link.click();
     document.body.removeChild(link);




//  };

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
    // image.crossOrigin = 'anonymous';
    // image.crossOrigin = "Anonymous";
    reset();

    // var prefix = "https://cors-anywhere.herokuapp.com/images.pexels.com/photos/879808/pexels-photo-879808.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260";
     image.src = imgUrl.value;

     

    //  if ( image.complete || image.complete === undefined ) {
    //     image.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    //     image.src = imgUrl.value;
    // }
 })


//  M.AutoInit();

 document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
  
  });

  
 document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.tabs');
    var instance = M.Tabs.init(elems);
 
  
  });





  function changeOverlay(event) {
    // var selector = document.getElementById('overlay-options');
    // var value = selector[selector.selectedIndex].value;
    // document.documentElement.style.setProperty('--mode', value);
    // console.log(value);



  
    var overlayOptions = document.querySelector('.overlay-options');
    let element = event.target;
    let elementName = element.getAttribute('id');
    console.log(elementName);


//     let selector;
    

// if(event.target == overlayOptions) {

//     elementName = 'mode';
//     selector = overlayOptions;

// }

    console.log(event.target);
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
        console.log(event.target.innerHTML)
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

var xyz = true;
var grrr = getComputedStyle(document.querySelector('.layer')).getPropertyValue('background');
let background = getComputedStyle(document.querySelector('.layer')).getPropertyValue('background');
// background = background.split(' ').slice(0, -9).join('');

if(document.getElementById('gradient-bcg').checked) {
    background = background.split(' ').slice(4, -8).join('');
} else {
    background = background.split(' ').slice(0, -9).join('');
}
var gr = true;

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
// var xyz = true;
// var grrr = getComputedStyle(document.querySelector('.layer')).getPropertyValue('background');
// var bgrr = getComputedStyle(document.querySelector('.layer')).getPropertyValue('background');
// var gr = true;
// var abc = `
//   .filter::before {
//     content: "";
//     display: block;
//     height: 100%;
//     width: 100%;
//     top: 0;
//     left: 0;
//     position: absolute;
//     pointer-events: none;
//     mix-blend-mode: darken;
//     background: ${document.getElementById('gradient-bcg').checked? grrr:bgrr};
//   }`

// document.querySelector('.code-container').innerHTML=`
// <pre><code>
// .filter {
//     position: relative;
//     -webkit-filter: brightness(105%) hue-rotate(350deg);
//     filter: brightness(105%) hue-rotate(350deg);
//   }
//   ${document.getElementById('none-bcg').checked?'':abc}
// </code></pre>
// `

 // function convertImageToCanvas(image) {
 //     var canvas = document.createElement("canvas");
 //     canvas.width = 500;
 //     canvas.height = 300;
 //     canvas.getContext("2d").drawImage(image, 0, 0);

 //     return canvas;
 // }

 // var ctx = convertImageToCanvas(document.querySelector('img'));

 // ctx.getContext('2d').filter = 'blur(20px)';


 //     var newImage = new Image();
 //     newImage.src = ctx.toDataURL("image/jpeg");
 //     console.log(newImage);
 // console.log(image);
 //     var button = document.getElementById('btn-download');
 //     button.addEventListener('click', function (e) {

 //         button.href = newImage.src;
 //     });






 // image.src = ctx.toDataURL("image/jpeg");

 // console.log(ctx.src);



 // let dataUrl = document.getElementById('image').toDataURL();