// Uncomment lines below for pluginLoader integration
jqPlugins.transactor = true;
$.loadCSS(['transactor']);

(function($){
	$.tran = {
		
		indicatorsInitialized:false,
		
		loadMsg:'Please Wait...',
		
		modalLoadGraphic:'/Images/loading_white.gif',
		
		passiveLoadGraphic:'/Images/loading4.gif',
		
		defaultMode:'modal',
		
		mode:'modal',
		
		waitTime:500,
		
		activeRequests:0,
		
		timer:false,
		
		onStart:false,
		
		onComplete:false,
		
		configure:function(data){
			var tranObject = this;
			// Set each of the passed properties
			jQuery.each(data,function(key,value){
				tranObject[key] = value;
				// Set the current mode to the default if there are no active requests.
				if(key=='defaultMode' && tranObject.activeRequests===0){
					tranObject.mode=value;
				}
			});
		},
		
		start:function(mode){
			// Change the mode if it is passed and there are no active requests.
			if(typeof mode != 'undefined' && this.activeRequests===0){
				this.mode = mode;	
			}
			// Write the indicator HTML to the DOM if it is not already there.
			if(!this.indicatorsInitialized){this.initCurtains();}
			// Display the curtain
			if(this.activeRequests===0){
				if(this.onStart){this.onStart();}
				this.showCurtain();
			}
			// Increment the active requests
			this.activeRequests++;
		},
		
		end:function(){
			// Decrement the active requests
			this.activeRequests--;
			// Close the curtain if there are no remaining requests
			if (this.activeRequests === 0) {
				// Clear any current timers
				clearTimeout(this.timer);
				// Set a timer to the waitTime to close the curtain
				this.timer = setTimeout(function(){
					// If there are still no more transactions, close the curtain and revert the current mode to the default.
					if ($.tran.activeRequests === 0) {
						$("#transactorLoadCurtain, #transactorPassiveCurtain").fadeOut();
						if($.tran.onComplete){$.tran.onComplete();}
						$.tran.configure({mode: $.tran.defaultMode});
					}
				}, this.waitTime);
			}
		},
		
		initCurtains:function(){
			// Only generate the HTML if the curtain does not yet exist.
			if($("#transactorLoadCurtain").length===0){
				$("body").append('<div id="transactorLoadCurtain" style="display:none;"><img src="' + this.modalLoadGraphic + '" title="' + this.loadMsg + '" alt="' + this.loadMsg + '" /> <div class="loadMsg">' + this.loadMsg + '</div></div>');	
			}
			if($("#transactorPassiveCurtain").length===0){
				$("body").append('<div id="transactorPassiveCurtain" style="display:none;"><img src="' + this.passiveLoadGraphic + '" title="' + this.loadMsg + '" alt="' + this.loadMsg + '" /> <div class="loadMsg">' + this.loadMsg + '</div></div>');	
			}
			// Indicate that the curtains have been created.
			this.indicatorsInitialized=true;
		},
		
		showCurtain:function(){
			// Set the ID of the curtain to use.
			var el = this.mode=='modal' ? 'transactorLoadCurtain' : 'transactorPassiveCurtain';
			// Set the path for the graphic to use.
			var graphic = this.mode=='modal' ? this.modalLoadGraphic : this.passiveLoadGraphic;
			// Update the curtain with the image and message
			$("#" + el + " img").attr("src",graphic).attr("title",this.loadMsg).attr("alt",this.loadMsg).find(".loadMsg").html(this.loadMsg);
			// Set the modal curtain to cover the screen
			if(this.mode=='modal'){
				$("#" + el).width($("body").width()).height(5000);
			}
			// Show the curtain
			$("#" + el).fadeIn();
		}
	};
})(jQuery);