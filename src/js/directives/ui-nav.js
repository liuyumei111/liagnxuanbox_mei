angular.module('app')
  .directive('uiNav', ['$timeout', function($timeout) {
    return {
      restrict: 'AC',
      link: function(scope, el, attr) {
        var _window = $(window), 
        _mb = 768, 
        wrap = $('.app-aside'), 
        next, 
        backdrop = '.dropdown-backdrop';
        // unfolded
        el.on('click', 'a', function(e) {
          next && next.trigger('mouseleave.nav');
          var _this = $(this);
          _this.parent().siblings( ".active" ).toggleClass('active');
          _this.next().is('ul') &&  _this.parent().toggleClass('active') &&  e.preventDefault();
          // mobile
          _this.next().is('ul') || ( ( _window.width() < _mb ) && $('.off-screen').removeClass('show off-screen') );
        });

        // folded & fixed
        el.on('mouseenter', 'a', function(e){
          next && next.trigger('mouseleave.nav');
          $('> .nav', wrap).remove();
          if ( !$('.app-aside-fixed.app-aside-folded').length || ( _window.width() < _mb ) || $('.app-aside-dock').length) return;
          var _this = $(e.target)
          , top
          , w_h = $(window).height()
          , offset = 50
          , min = 150;

          !_this.is('a') && (_this = _this.closest('a'));
          if( _this.next().is('ul') ){
             next = _this.next();
          }else{
            return;
          }
         
          _this.parent().addClass('active');
          top = _this.parent().position().top + offset;
          next.css('top', top);
          if( top + next.height() > w_h ){
            next.css('bottom', 0);
          }
          if(top + min > w_h){
            next.css('bottom', w_h - top - offset).css('top', 'auto');
          }
          next.appendTo(wrap);

          next.on('mouseleave.nav', function(e){
            $(backdrop).remove();
            next.appendTo(_this.parent());
            next.off('mouseleave.nav').css('top', 'auto').css('bottom', 'auto');
            _this.parent().removeClass('active');
          });

          $('.smart').length && $('<div class="dropdown-backdrop"/>').insertAfter('.app-aside').on('click', function(next){
            next && next.trigger('mouseleave.nav');
          });

        });

        wrap.on('mouseleave', function(e){
          next && next.trigger('mouseleave.nav');
          $('> .nav', wrap).remove();
        });
      }
    };
  }]);
  angular.module('app')
    .directive('jpagination', function(){
      return {
        restrict: 'E',
        scope: {
          numPages: '=',
          currPage: '=',
          onSelectPage: '&'
        },

        template: '<ul class="pagination pagination-sm m-t-none m-b-none">'
        +'<li ng-class="{disabled: noPreviousPage()}">'
        +'<a ng-click="selectPreviousPage()">上一页</a>'
        +'</li>'

        +'<li ng-repeat="page in pages" ng-class="{active: isActivePage(page)}">'
        +'<a ng-click="selectPage(page)">{{page}}</a>'
        +'</li>'

        +'<li ng-class="{disabled: noNextPage()}">'
        +'<a ng-click="selectNextPage()">下一页</a>'
        +'</li>'

        +'</ul>',

        replace: true,
        link: function(s){
          s.$watch('numPages', function(value){
            s.pages = [];

            for(var i=1;i<=value;i++){
              s.pages.push(i);
            }

            if(s.currPage > value){
              s.selectPage(value);
            }
          });

          //判读是否有上一页
          s.noPreviousPage = function(){
            return s.currPage === 1;
          };

          //判断是否有下一页
          s.noNextPage = function(){
            return s.currPage === s.numPages;
          };

          //判断当前页是否被选中
          s.isActivePage = function(page){
            return s.currPage===page;
          };

          //选择页数
          s.selectPage = function(page){
            if(!s.isActivePage(page)){
              s.currPage = page;

              s.onSelectPage({ page:page });
            }
          };

          //选择下一页
          s.selectNextPage = function(){
            if(!s.noNextPage()){
              s.selectPage(s.currPage+1);
            }
          };

          //选择上一页
          s.selectPreviousPage = function(){
            if(!s.noPreviousPage()){
              s.selectPage(s.currPage-1);
            }
          };
        }
      };
    });
