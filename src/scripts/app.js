'use strict'

const image = document.querySelectorAll('.gallery__img');

const resize = () => {
  image.forEach(function(item) {
   
      item.style.height = 100 + "%";

  });
};
resize();