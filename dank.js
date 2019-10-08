(function($) {

    this.Dank = function() {
        var initfloat = false;
        var floats = null;
        var prevScrollPos = 0;
        var scrollPos = 0;
        var visibilityOffset = 0;
        var offsetUnit = '%';
            
        var defaults = {
            selector : $('.dank'),
            scrollDirection : false,
            power : 8,
            speed : 0.5,
            offset : '20%', //percent or px
            stepSize : 40,
            exponential : true,
            inView : true
        }
            
        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = extendDefaults(defaults, arguments[0]);
        }

        Dank.prototype.init = function(){
            floats = $(defaults.selector);
            if(defaults.offset.indexOf('%')){
                var offsetVal = defaults.offset.substring(0, defaults.offset.indexOf('%'));
                visibilityOffset = $(window).height() * offsetVal / 100;
            }else if(defaults.offset.indexOf('px')){
                var offsetVal = defaults.offset.substring(0, defaults.offset.indexOf('px'));
                visibilityOffset = offsetVal;
            }else{
                visibilityOffset = defaults.offset;
            }
            if(floats){
                $(floats).each(function(index){
                    var easingSpeed = $(this).data('dank-speed') || defaults.speed;
                    $(this).css({
                        'transform': 'translate3d(0,0,0)',
                        'transition':'transform ' + easingSpeed + 's ease-out'
                    });
                });
                $(window).on('scroll', movefloats);
            }
        }

        function extendDefaults(source, properties) {
            var property;
            for (property in properties) {
                if (properties.hasOwnProperty(property)) {
                    source[property] = properties[property];
                }
            }
            return source;
        }

        function movefloats(){
            scrollPos = $(window).scrollTop();
            var deltaScroll = getDeltaScroll(scrollPos, prevScrollPos);
            $(floats).each(function(index){
                if(isvisible(this)){
                    $(this).css('transform', 'translate3d(0px, ' + calcposY(this, deltaScroll) + 'px, 0px)');
                }
            });
            prevScrollPos = scrollPos;
        }

        function getDeltaScroll(cs, ps){
            if(cs - ps > 0){
                return defaults.stepSize * -1;
            }else{
                return defaults.stepSize;
            }
        }

        function calcposY(el, delta){
            var power = $(el).data('dank-power') || defaults.power;
            var movePower = delta * power / 10;
            var getTransformVal = defaults.scrollDirection ? -1 * parseInt(getTransformY(el)) : parseInt(getTransformY(el));
            var translateYAmount = defaults.exponential ? getTransformVal + movePower : movePower;
            if($(el).data('dank-power') == 11){
                console.log('---------');
                console.log(getTransformVal);
                console.log(defaults.exponential);
                console.log(power);
                console.log(movePower);
                console.log(translateYAmount);
                console.log(getTransformVal + movePower * power / 10);
            }
            var translateYVal = defaults.scrollDirection ? -1 * translateYAmount : translateYAmount;
            return translateYVal;
        }

        function getTransformX(el){
            var transformMatrix = $(el).css("-webkit-transform") ||
            obj.css("-moz-transform")    ||
            obj.css("-ms-transform")     ||
            obj.css("-o-transform")      ||
            obj.css("transform");
            var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
            return matrix[12] || matrix[4];
        };

        function getTransformY(el){
            var transformMatrix = $(el).css("-webkit-transform") ||
            obj.css("-moz-transform")    ||
            obj.css("-ms-transform")     ||
            obj.css("-o-transform")      ||
            obj.css("transform");
            var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',');
            return matrix[13] || matrix[5];
        };

        function isvisible(el){
            if(!defaults.inView){
                return true;
            }
            var offset, bottom, top, viewBottom, viewTop;
            offset = visibilityOffset;
            viewTop = window.pageYOffset - offset;
            viewBottom = window.pageYOffset + $(window).height() + offset;
            top = $(el).offset().top;
            bottom = top + $(el).height();
            return top <= viewBottom && bottom >= viewTop;
        }
    }
}(jQuery));
new Dank().init();