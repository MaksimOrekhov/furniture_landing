'use strict';

var image = document.querySelectorAll('.gallery__img');

var resize = function resize() {
  image.forEach(function (item) {

    item.style.height = 100 + "%";
  });
};
resize();