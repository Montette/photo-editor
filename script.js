 const inputs = document.querySelectorAll('.controls input');
 const imgUrl = document.getElementById('photo-link');




 let imageInput = document.getElementById('file');
 let image = document.getElementById('image');





 const reset = () => {
     document.querySelectorAll('.controls input').forEach(el => {
         el.value = 0;
         document.documentElement.style.setProperty(`--${el.name}`, `0${el.dataset.sizing}`);
     });
     document.documentElement.style.setProperty('--width', '600px');
     document.documentElement.style.setProperty('--saturate', '100%');
     document.documentElement.style.setProperty('--opacity', '100%');
     document.documentElement.style.setProperty('--brightness', '100%');
     document.documentElement.style.setProperty('--contrast', '100%');


     document.querySelector('#width').value = 500;
     document.querySelector('#saturate').value = 100;
     document.querySelector('#opacity').value = 100;
     document.querySelector('#brightness').value = 100;
     document.querySelector('#contrast').value = 100;
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





 const inputUpdate = (event) => {
     const suffix = event.target.dataset.sizing || '';
     let elementName = event.target.name;
     let newValue = event.target.value + suffix;

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


     if (degs !== 0) {

         c.width = image.width * 2;
         c.height = image.height * 2;

         let radians = Math.PI / 180;
         let x = newWidth / 2;
         let y = newHeight / 2;
         ctx.clearRect(0, 0, c.width, c.height);
         ctx.save();
         ctx.translate(c.width / 2, c.height / 2);
         ctx.rotate(degs * radians);
         console.log(y);
         console.log(x);
         ctx.filter = filters;
        
         ctx.drawImage(image, leftIm, topIm, newRight, newBott, (-x), (-y), (newWidth), (newHeight));
         ctx.restore();

         // (-x/2.3), (-y/2.5)

         console.log('fff');
     } else {

         c.width = newWidth;
         c.height = newHeight;
         console.log('no');
         console.log(filters);
         console.log(degs);
         ctx.filter = filters;
         
         ctx.drawImage(image, leftIm, topIm, newRight, newBott, 0, 0, newWidth, newHeight);
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

 document.querySelector('.file-uploads__button').addEventListener('click', () => {
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



  function changeGradient() {
    var selector = document.getElementById('overlay-options');
    var value = selector[selector.selectedIndex].value;
    document.documentElement.style.setProperty('--mode', value);
    console.log(value);
}

document.getElementById('overlay-options').addEventListener('change', changeOverlay);

document.getElementById('gradient-directions').addEventListener('change', changeGradient);

document.getElementById('solid-bcg').addEventListener('click', (event)=> {
    document.querySelector('.gradient-colors').classList.add('disabled');
    document.querySelector('.overlay-color').classList.remove('disabled');

})

document.getElementById('gradient-bcg').addEventListener('click', (event)=> {
    document.querySelector('.overlay-color').classList.add('disabled');
    document.querySelector('.gradient-colors').classList.remove('disabled');
})



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