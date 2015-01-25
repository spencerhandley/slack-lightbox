// Everything is wrapped in an IIFE to avoid assigning variables to the global scope
(function(){
	'use strict';

	var photos = document.getElementsByClassName('thumbnail');

	var background;
	var frame;
	var currentImage;

	// Creates a Thumbnail DOM node with the required attributes

	var createThumb = function(thumb, selectRow){
		var image = document.createElement('img');
		image.setAttribute('src', thumb.photo);
		image.setAttribute('data-title', thumb.caption);
		image.setAttribute('data-id', thumb.index);
		image.setAttribute('id', thumb.index);
		image.setAttribute('class', 'three columns thumbnail');
		image.addEventListener('click', photoClickHandler);
		selectRow.appendChild(image);
	};

	var photoClickHandler = function(evt){
		// Set current image on parent scope
		currentImage = parseFloat(evt.srcElement.id);

		var imagePath = evt.srcElement.currentSrc;
		var titleVal = evt.srcElement.dataset.title;

		// Dark background div
		var bg = document.createElement('div');
		bg.setAttribute('id', 'lightbox-bg');	

		// Lightbox frame
		frame = document.createElement('div');
		frame.setAttribute('id', 'lightbox');	

		// Image DOM node
		var image = document.createElement('img');
		image.setAttribute('src', imagePath);
		image.setAttribute('id', 'lightbox-image');
		image.className = 'lightbox-image';

		// Title DOM node
		var title = document.createElement('p');
		title.className = 'lightbox-title';
		var textNode = document.createTextNode(titleVal);
		title.appendChild(textNode);

		// Next Button DOM node
		var nextBtn = document.createElement('p');
		nextBtn.className = 'next-btn';
		var textNode = document.createTextNode('next');
		nextBtn.appendChild(textNode);
		nextBtn.addEventListener('click', nextHandler);

		// Previous Button DOM node
		var prevBtn = document.createElement('p');
		prevBtn.className = 'prev-btn';
		var textNode = document.createTextNode('prev');
		prevBtn.appendChild(textNode);
		prevBtn.addEventListener('click', prevHandler);

		// Append necessary elements as children of the frame
		frame.appendChild(image);
		frame.appendChild(title);
		frame.appendChild(prevBtn);
		frame.appendChild(nextBtn);

		// Assign bg and frame as children of document.body
		document.body.appendChild(bg);
		document.body.appendChild(frame);

		// Set up event handling for clicks on the background
		background = bg;
		background.addEventListener('click', closeHandler);

		// Transition elements onto the page with CSS
		setTimeout(function(){
			bg.className = bg.className ? '' : 'fade';
			frame.className = frame.className ? '' : 'fade';
		}, 0);

	};


	// Button Handlers for pervious and next functionality
	// * Basic functionality relies upon the id attribute
	var prevHandler = function(evt){
		var image = document.getElementById('lightbox-image');
		currentImage = currentImage-1;
		var targetImage = document.getElementById((currentImage).toString()).currentSrc;
		image.setAttribute('src', targetImage);
	};

	var nextHandler = function(evt){
		var image = document.getElementById('lightbox-image');
		currentImage = currentImage+1;
		var targetImage = document.getElementById((currentImage).toString()).currentSrc;
		image.setAttribute('src', targetImage);
	};


	// Handles closing the box and removes DOM nodes when
	// the user clicks the black area around the Lightbox
	var closeHandler = function(){

		// Get the lightbox elements
		var bgEl = document.getElementById('lightbox-bg');
		var frameEl = document.getElementById('lightbox');

		// Fade the elements out with CSS transitions
		background.className = background.className ? '' : 'fade';
		frame.className = frame.className ? '' : 'fade';

		// After a half second, remove the elements to avoid clogging the DOM
		// The setTimeout allows the CSS transition to complete before removing elements
		setTimeout(function(){
			document.body.removeChild(bgEl);
			document.body.removeChild(frameEl);
		}, 500);

	};


	//  This is the Ajax method which gets the images from instagram,
	//  It relies upon the jquery-instagram library https://github.com/potomak/jquery-instagram
	
	jQuery(function($) {

	  $('.instagram').on('didLoadInstagram', function(event, response) {

	  	// Create a new row and append it
	    var row = document.createElement('div');
	    row.className = 'row';
	    document.getElementById('images').appendChild(row);

	    // Iterate through the response data
	    for (var i = 0; i < response.data.length; i++) {

	    	// Every fourth image, create a new row and direct subsequent images to it.
	    	if(i % 4 === 0){
			    row = document.createElement('div');
			    row.className = 'row';
			    document.getElementById('images').appendChild(row);
	    	}

	    	var thumb = {};
	    	thumb.photo = response.data[i].images.standard_resolution.url;
	    	thumb.caption = response.data[i].caption.text;
	    	thumb.index = i;
	    	createThumb(thumb, row);

	    };
	  });

		// Instagram query
	  $('.instagram').instagram({
	    hash: 'chrisburkard',
	    clientId: 'ceef2a0b65004a4ba95ec9e05aa22e24'
	  });

	});
})();

