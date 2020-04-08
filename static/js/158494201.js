function layer_media_init_func(layerid){
	var $curlayer=$('#'+layerid), _duration = -1;
	$('#wp-media-image_'+layerid).mouseover(function (event) {
		if($curlayer.data('wopop_effects') && $curlayer.hasClass('now_effecting')){
			return;
		}
		var effect=$curlayer.data('wopop_imgeffects');
		var $this=$(this);
		var running=$this.data('run');
		if(effect && running!=1){
			var effectrole = effect['effectrole'];
			var dset = effect['dset']; 
			var effectel=$curlayer;
			if(effectrole=='dantu' &&  effect['effect']=="effect.rotation"){
				$curlayer.data('iseffectrotate',true);
				effectel=$curlayer.find('.wp-media_content');
			}else if(effectrole !='dantu' && dset && dset['effect']=="effect.rotation"){
				$curlayer.data('iseffectrotate',true);
				effectel=$curlayer.find('.wp-media_content');
			}
			
			effectel.setimgEffects(true,effect,1);
			
			if(effectrole !='dantu' && typeof(dset)!="undefined"){
				// fixed bug#5949
				if ($curlayer.hasClass('now_effecting')) {
					_duration = dset.duration;
					$curlayer.wopop_effect_command('stop');
				}
				var temp_effect = {};
				temp_effect['type'] = effect['type'];
				temp_effect['effectrole'] = 'dantu';
				temp_effect['effect'] = effect['dset']['effect'];
				temp_effect['duration'] =  effect['dset']['duration'];
				effectel.setimgEffects(true,temp_effect,1);
			}
		}
	});
	// fixed bug#5949
	$curlayer.mouseleave(function(e){
		var $target = $(this), _tt = parseInt(_duration);
		if (!isNaN(_tt) && _tt >= 0 && !$target.hasClass('now_effecting')) {
			var timer = setTimeout(function(){
				$target.showEffects();
				_duration = -1;
				clearTimeout(timer);
			}, _tt);
		}
	});

	var imgover=$('#wp-media-image_'+layerid).closest('.img_over');
	imgover.children('.imgloading').width(imgover.width()).height(imgover.height());
	imgover.css('position','relative');
	$('#'+layerid).layer_ready(function(){
		layer_img_lzld(layerid);
	});
};
function layer_sitesearch_init_func(param,urllist,searchFlag){
	var wp_productsearchcache=param.wp_productsearchcache;
	var langs=param.langs;
	var layerid=param.layer_id;
	$('#'+layerid).layer_ready(function(){
					var vskin =param.skin,$curlayer = $('#'+layerid);
					if(vskin=='skin4' || vskin=='skin5' || vskin=='skin6' || vskin=='skin7' || vskin=='skin8'){ 
							$curlayer.find('.searchtype').css({'display':'none'});
					}else $curlayer.find('.searchtype').css({'display':'block'});
					if(vskin=='skin4' || vskin=='skin5'){
					//adapt extend skin width 2014.4.27
							$curlayer.bind("fixedsearchwidth",function(e,width){
									var $target = $(this),$targetwidth = $target.find('.searchbox');
									//if(width != undefined) $targetwidth.css("width", width+'px');
									var this_btn_width =  $target.find('.searchbox_btn').outerWidth(true);
									var this_txt_width =  $target.find('.searchbox_txt').outerWidth(true);
									$targetwidth.css({'width':this_btn_width+this_txt_width});
							}).triggerHandler("fixedsearchwidth");
					//<<<end
					}
		var dom=$('#'+layerid);
		var domhtml=dom.find('.wp-sitesearch_container').html();
		//此处将页而ID存到本地解决在新的链接窗口中获取不到值的问题
		var article_page = param.article_page;
		var product_page =param.product_page;
		dom.data('article_page',article_page);
		dom.data('product_page',product_page);

		var article_pageres = param.article_pageres;
		var product_pageres =param.product_pageres;
		dom.data('article_pageres',article_pageres);
		dom.data('product_pageres',product_pageres);

		dom.data('search_type',param.search_type);
		dom.data('sswitch',param.sswitch);
		dom.data('openArticleUrl',param.openArticleUrl);
		dom.data('openProductUrl',param.openProductUrl);
		dom.data('search_listNum',param.search_listNum);
		dom.data('extend_content',param.extend_content);//add extend skin content
		if(domhtml.length>0){
			dom.find('.sright').click(function(){
				//explain:此处不知道为什么从dom对象中获取不到输入框的值，先改为$全局对象,author:fpf,date:2015-01-27,action:modify;
				//修改bug(1694)
				//var keywords=$.trim(dom.find('input[name="keywords"]').val());
				if(vskin=='skin8'){
					var keywords=$.trim($(this).parent().parent().parent().find('input[name="keywords"]').val());
				} else{
					var keywords=$.trim($(this).parent().find('input[name="keywords"]').val());
				}
				if(keywords.length == 0&&vskin!='skin8') {dom.find('input[name="keywords"]').focus();return false;}
														if(vskin=='skin8'){
																var lowprice=$.trim(dom.find('input[name="lowprice"]').val().replace(/[^0-9]/ig,""));
																if(lowprice.length == 0) {dom.find('input[name="lowprice"]').focus();return false;}
																var highprice=$.trim(dom.find('input[name="highprice"]').val().replace(/[^0-9]/ig,""));
																if(highprice.length == 0) {dom.find('input[name="highprice"]').focus();return false;}
														}

				// 根据skin5,6,7,8,9的设置项进行搜索
				if(searchFlag != 0 && searchFlag != 4){
                    if(vskin=='skin4' || vskin=='skin5' || vskin=='skin6' || vskin=='skin7' || vskin=='skin8'){
                        if(searchFlag == 1){
                            str = 'title';
                        }else if(searchFlag == 2){
                            str = 'intro';
                        }else if(searchFlag == 3){
                            str = 'content';
                        }
                    }
				}else{
                    var selid=new Array();
                    var i=0;
                    dom.find(".catetype").each(function(){
                        if($(this).prop("checked")){ selid[i]=$(this).val(); i++;}

                    });

                    var str='';
                    if(selid.length>0){
                        str=selid.join(',');
                    }
                    if(str.length==0){ str='title'; }
                }

				var infotype=0;
				var sourcecotent=parent.$('#'+layerid).find('input[name=searchcontent]').val();
				if(sourcecotent !='article' &&sourcecotent !='product'){
					if(dom.find('.type_title').html()!=langs['Search Pro']){
						infotype=1;
					}
									if(vskin=='skin4' || vskin=='skin5' || vskin=='skin6' ||  vskin=='skin8'){
											infotype=0;
									}
				}else if(sourcecotent=='article'){
					infotype=1;
				}else if(sourcecotent=='product'){
					infotype=0;
				}



				dom.attr('infotype',infotype);
				$('body').data('wp_searchcache1','1');
				var search_type = dom.data('search_type');
				var searchskin = 2;
				if(vskin=='skin4' || vskin=='skin5' || vskin=='skin6' || vskin=='skin7' || vskin=='skin8'){
                    if(searchFlag != 0 && searchFlag != 4){
                        searchskin = 2;
					}else{
                        searchskin = 1;
                    }
				}
				var open = $.trim(dom.find('.wp-sitesearch_container').attr('opn'));
				if(vskin=='skin8'){ //add high low price
						var url=parseToURL('sitesearch','search',{search_listNum:dom.data('search_listNum'),openProductUrl:dom.data('openProductUrl'),search_type:dom.data('search_type'),sswitch:dom.data('sswitch'),openArticleUrl:dom.data('openArticleUrl'),article_page:article_page,product_page:product_page,keywords:keywords,searchskin:searchskin,lowprice:lowprice,highprice:highprice,type:str,infotype:infotype,layerid:layerid,"searchFlag":searchFlag});
				}else{
						var url=parseToURL('sitesearch','search',{search_listNum:dom.data('search_listNum'),openProductUrl:dom.data('openProductUrl'),search_type:dom.data('search_type'),sswitch:dom.data('sswitch'),openArticleUrl:dom.data('openArticleUrl'),article_page:article_page,product_page:product_page,keywords:keywords,searchskin:searchskin,type:str,infotype:infotype,layerid:layerid,"searchFlag":searchFlag});
				}

				var murl = '#';
              
				if(search_type==1){
                                    keywords = encodeURIComponent(keywords);
					if(infotype==1){
						if(urllist['sitesearch_artlist']) murl = urllist['sitesearch_artlist'];
					}else{
						if(urllist['sitesearch_prolist']) murl = urllist['sitesearch_prolist'];
					}

					url = murl;
					if(url!="#"){
						if(url.indexOf("?")>0){
							url = url+"&page=1&search_txt="+keywords+"&type="+str+"&searchskin="+searchskin;
						}else{
							url = url+"?page=1&search_txt="+keywords+"&type="+str+"&searchskin="+searchskin;
						}
						if(vskin=='skin8'){
							url = url+"&lowprice="+lowprice+"&highprice="+highprice;
						}
					}
				}

				if(open=='1'){
					window.open(url,'_blank');
				}else{
					if(search_type==1){
						if((infotype==0 && param.openProductUrl=='1') ||
							(infotype==1 && param.openArticleUrl=='1')){
							window.open(url,'_blank');
						}else{
							window.location.href= url;
						}
					}else{
						$LAB
						.script(relativeToAbsoluteURL("plugin/sitesearch/js/sitesearch_browser.js"))
						.wait(function(){
							wp_sitesearch(url,{
								title:langs['Search Result'],
								width: 791,
								top:60
							});
						})
					}
				}
			});

			dom.find('input[name="keywords"]').keydown(function(event){
				if(event.keyCode==13){
						dom.find('.sright').trigger('click');
				}
			});

			dom.find('.type_select span').click(function(){
				dom.find('.type_title').html($(this).html());
				dom.find('.type_select').hide();
				if($(this).html() ==langs['Search Pro']){
					dom.find('.s_title').html(langs['Name']);
					dom.find('.s_description').html(langs['Description']);
					$(this).html(langs['Search Art']);
					$('body').data('wp_searchcache',wp_productsearchcache);
					dom.find("input[name='keywords']").autocomplete("option","source",wp_productsearchcache);
				}else{
					dom.find('.s_title').html(langs['Search Title']);
					dom.find('.s_description').html(langs['Search Summary']);
					$(this).html(langs['Search Pro']);
					if(window.wp_articlesearchcache == undefined)
					{
						$.ajax({
							url:parseToURL("sitesearch","article_titlesearch"),
							async:false,
							success:function(data){
								window.wp_articlesearchcache = eval(data);
								$('body').data('wp_searchcache',window.wp_articlesearchcache);
								dom.find("input[name='keywords']").autocomplete("option","source",window.wp_articlesearchcache);
							}
						});
					}
					else
					{
						dom.find("input[name='keywords']").autocomplete("option","source",window.wp_articlesearchcache);
					}
				}

			});

			dom.find('.nsearch').hover(function(){
				dom.find('.type_select').show();
				dom.find('input[name="keywords"]').autocomplete("close");
			},function(){
				dom.find('.type_select').hide();
			});
			var width_xz=0;
			if($.browser.msie && $.browser.version>=9){ width_xz=4;}
			var additionwidth=0;
			var funci=0;
			var func=function(){
				if(dom.width()>dom.find('.sleft').outerWidth(true)||funci>=3){

					var domFidType = $('#'+dom.attr('fatherid')).attr('type');
					var domFidDly = $('#'+dom.attr('fatherid')+'_pop_up').css('display');
					var domFidVsl = $('#'+dom.attr('fatherid')+'_pop_up').css('visibility');

					if(param.editmode==1){
                        if(domFidType == 'pop_up' && domFidDly == 'none'){
                            $('#'+dom.attr('fatherid')+'_pop_up').css({'display':'block','visibility':'hidden'});
                        }
                    }else{
                        $('#'+dom.attr('fatherid')+'_pop_up').css({'display':'block','visibility':'hidden'});
                    }

					if(dom.find('.sright2').length) additionwidth+=dom.find('.sright2').outerWidth(true);
                    dom.find('.ninput').css({'width':(dom.width()-dom.find('.sleft').outerWidth(true)-dom.find('.sright').outerWidth(true)-additionwidth-dom.find('.nsearch').outerWidth(true)-width_xz)-4+'px'});
                    dom.find('.ninput input').width(dom.find('.ninput').width());

                    if(param.editmode==1){
                        if(domFidType == 'pop_up' && domFidDly == 'block' && domFidVsl == 'hidden'){
                        	$('#'+dom.attr('fatherid')+'_pop_up').css({'display':'none','visibility':'visible'});
                        }
					}else{
                        $('#'+dom.attr('fatherid')+'_pop_up').css({'display':'none','visibility':'visible'});
					}
				}else{
					funci+=1;
					setTimeout(func,300);
				}
			}
			func();
			//搜索按钮文字设置
		    if (vskin == 'default'||vskin == 'skin4'||vskin == 'skin7'||vskin == 'skin8' ) {
		        var extcont = dom.data('extend_content');
		        var seatext = extcont.sitesearchbuttext;
		        var pattern = /[\u4e00-\u9fa5]+/;
		        if(typeof(seatext) != 'undefined'){
		        	var sealent = seatext.length;
			        $curlayer.find('.searchbox .bcenter').text(seatext);
			        $curlayer.find('.searchbox .searchbox_btn').text(seatext);
			        if(pattern.test(seatext)) {
			          	if(vskin == 'default') {
			            	var sealent1 = (sealent>2?10*(sealent-2)+(sealent-2):0);
			                var width = $curlayer.find('.searchbox .ninput').css('width');
			                $curlayer.find('.searchbox .ninput').css({width:(parseInt(width)-sealent1)+'px'});
			                $curlayer.find('.searchbox input').css({width:(parseInt(width)-sealent1)+'px'});
			            }
			            if(vskin == 'skin7') {
			              	var sealent1 = (sealent>3?10*(sealent-3)+1:0);
			                var width = $curlayer.find('.searchbox input').css('width');
			                $curlayer.find('.searchbox input').css({width:(parseInt(width)-sealent1)+'px'});
			                var width = $curlayer.find('.searchbox .searchbox_btn').css('width');
			                $curlayer.find('.searchbox .searchbox_btn').css({width:(parseInt(width)+sealent1)+'px'});
			            }
			            if(vskin == 'skin8') {
			              	var sealent1 = (sealent>3?10*(sealent-3)+1:0);
			                var width = $curlayer.find('.searchbox .searchbox_btn').css('width');
			                $curlayer.find('.searchbox .searchbox_btn').css({width:(parseInt(width)+sealent1)+'px'});
			            }
			        }
		        }
		    }
		}
		if(!param.editmode){
					var autocomplete_width,autocomplete_date;
					if(vskin=='default' || vskin=='skin1' || vskin=='skin2' || vskin=='skin3'){
							autocomplete_width = dom.find("input[name='keywords']").parent().outerWidth()+dom.find('.searchbox').children('.sleft').outerWidth()+dom.find('.nsearch').outerWidth()
					}else{autocomplete_width = dom.find('.searchbox_txt').parent().outerWidth() }
					var wp_searchdefalut =param.sshdefalutshow;
					if(wp_searchdefalut==1){
						if(window.wp_articlesearchcache == undefined)
						{
										$.ajax({
														url:parseToURL("sitesearch","article_titlesearch"),
														async:false,
														success:function(data){
																		window.wp_articlesearchcache = eval(data);
																		$('body').data('wp_searchcache_default',window.wp_articlesearchcache);
																		dom.find("input[name='keywords']").autocomplete("option","source",window.wp_articlesearchcache);
														}
										});
						}
						else{
										dom.find("input[name='keywords']").autocomplete("option","source",window.wp_articlesearchcache);
						}
						autocomplete_date = $('body').data('wp_searchcache_default');
					}else{ autocomplete_date = $('body').data('wp_searchcache'); }
					dom.data('wp_searchcache',autocomplete_date);
					// 数据量超过一千会有明显卡顿，此处现取前一千来比对	by lsf 2015/01/15
			dom.find("input[name='keywords']").autocomplete({
				source:autocomplete_date.slice(0,1000),
				appendTo:dom,
				width:autocomplete_width,
				open:function(event,ui){
					$('.ui-autocomplete').css('left','0px');
				},
				select:function(event,ui){
					dom.find('.searchtype').prop('checked','false');
					dom.find("input[value='title']").prop('checked',true);
				}
			});
		}
		dom.data('interface_locale',getSiteCurLang());
		//explain:修复bug(1601)搜索插件的输入框在浏览器器缩放时因其宽度问题导致后面的搜索按钮不在同一行显示，现在手动减去5px以解决该问题,author:fpf,date:2015-01-20,action:modify;
		function detectZoom (){
				var ratio = 0,
				screen = window.screen,
				ua = navigator.userAgent.toLowerCase() || '';
				if (window.devicePixelRatio !== undefined) {
						ratio = window.devicePixelRatio;
				}else if (~ua.indexOf('msie')) {
						if (screen.deviceXDPI && screen.logicalXDPI) {
								ratio = screen.deviceXDPI / screen.logicalXDPI;
						}
				}else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
						ratio = window.outerWidth / window.innerWidth;
				}
				if (ratio){
						ratio = Math.round(ratio * 100);
				}
				return ratio;
		};
		var devicePixelRatios = detectZoom();
		var ischrome = navigator.userAgent.toLowerCase() || '';
		if(devicePixelRatios != 100 && ischrome.match(/chrome/)){
			var $search = dom.find('input.searchbox_txt');
			var search_width = parseFloat($search.width()).toFixed(2);
			if(search_width && search_width > 5){$search.width(search_width - 5);}
		}
	});

}

;
function wp_getdefaultHoverCss(layer_id)
{
	var getli='';
	var geta='';
	var cssstyle='';

	var navStyle = wp_get_navstyle(layer_id,'datasty_');
	if(navStyle.length > 0)
	{
		var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop:\\s*hover\\s*{[^}]+}",'i');
		var tmp = patt1.exec(navStyle);
		if(tmp)
		{			
			var tmp1 = tmp[0].match(/{[^}]+}/)[0];
			tmp1=tmp1.replace('{','').replace('}','');
			getli=getli+tmp1;
		}
 
		patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
		tmp = patt1.exec(navStyle);
		if(tmp)
		{			
			var tmp2 = tmp[0].match(/{[^}]+}/)[0];
			tmp2=tmp2.replace('{','').replace('}','');
			geta=geta+tmp2;
		}		
		
		
	}

	navStyle = wp_get_navstyle(layer_id,'datastys_');
	var getlia='';
	if(navStyle.length > 0)
	{		 
		var layidlow=('#nav_'+layer_id+' li.wp_subtop>a:hover').toLowerCase();
		if( ('a'+navStyle).toLowerCase().indexOf(layidlow)>0){			
			var parstr="#nav_"+ layer_id +" li.wp_subtop>a:hover";
			getlia = navStyle.split(new RegExp(parstr,"i"));
			var combilestr='';
			for(key in getlia){
				var ervervalue='';				
				if(('a'+getlia[key]).indexOf('{')<3 && ('a'+getlia[key]).indexOf('{')>0 ){
					var parvalue=getlia[key].split('{');
					if(('a'+parvalue[1]).indexOf('}')>0){
						ervervalue=parvalue[1].split('}')[0];
					}
				}
				combilestr=combilestr+ervervalue;
			}
			geta=geta+combilestr;
		}
		
		layidlow=('#nav_'+layer_id+' li.wp_subtop:hover').toLowerCase();
		if( ('a'+navStyle).toLowerCase().indexOf(layidlow)>0){			
			var parstr="#nav_"+ layer_id +" li.wp_subtop:hover";
			getlia = navStyle.split(new RegExp(parstr,"i"));
			var combilestrs='';
			for(var key in getlia){
				var ervervalue='';				
				if(('a'+getlia[key]).indexOf('{')<3 && ('a'+getlia[key]).indexOf('{')>0 ){
					var parvalue=getlia[key].split('{');
					if(('a'+parvalue[1]).indexOf('}')>0){
						ervervalue=parvalue[1].split('}')[0];
					}
				}
				combilestrs=combilestrs+ervervalue;
			}
			getli=getli+combilestrs;
		}
	 
		
	}
	
	if(getli.length>0){
		getli="#"+layer_id+" li.lihover{"+getli+"} ";
	}
	if(geta.length>0){
		geta="#"+layer_id+" li>a.ahover{"+geta+"} ";
	}
	cssstyle=getli+geta;
	if(cssstyle.length>0 && ($('#canvas #'+layer_id).length>0 || $('#site_footer #'+layer_id).length>0)){
		cssstyle=""+cssstyle+"";
		cssstyle=cssstyle.replace(/[\r\n]/g, " ").replace(/\s+/g, " "); 
		var doms=$('#'+layer_id);
		var oldcssstyle=doms.data('get_layer_hover_css');
		if(oldcssstyle != cssstyle){
			$("#hover"+layer_id+"").text(""+cssstyle+"");
			doms.data('get_layer_hover_css',cssstyle);
			get_plugin_css("H"+ layer_id +"H",cssstyle);
		}
	}
}

function wp_showdefaultHoverCss(layer_id){
	var layertype=$('#'+layer_id).attr('type');
	if(layertype && window['wp_showdefaultHoverCss_'+layertype]){
		return window['wp_showdefaultHoverCss_'+layertype](layer_id);
	}
	return false;
}

function wp_showdefaultHoverCss_new_navigation(layer_id)
{
	 
	var plugin_name=$("#"+layer_id).attr('type');
	var hover=$("#"+layer_id).find('.nav1').attr('hover');
	if(hover!=1){ return;}
	
	wp_getdefaultHoverCss(layer_id);
	var n=0;
	var rootpid=0;
	if(plugin_name=='new_navigation'){
		var page_id=$("#page_id").val();
		rootpid=$("#page_id").attr("rpid")*1;
	}else{
		var page_id=$('#'+layer_id+'').find(".default_pid").html();
		if(page_id==0 || page_id.length==0){
			page_id=$('#nav_'+layer_id+'').children('li:first').attr('pid');	
		}
	}

	$('#nav_'+layer_id+'').children('li').each(function(){
		var type_pid=$(this).attr('pid');		
		if( (type_pid==page_id ) && plugin_name=='new_navigation' ){
			$(this).addClass("lihover").children('a').addClass("ahover");
		}
		if(type_pid==rootpid && rootpid>0){
			$(this).addClass('rootlihover');
		}
		var t_bool = false;
		var whref = window.location.href.replace(/^https?:/,'').replace(/&brd=1$/,'');;
		var t_href= $(this).find("a").attr("href").replace(/^https?:/,'').replace(/&brd=1$/,'');;
 		var $nav1 =  $('#'+layer_id).children('.wp-new_navigation_content').children('.nav1');
		var sethomeurl = $nav1.attr("sethomeurl");
		if(sethomeurl) sethomeurl = sethomeurl.replace(/^https?:/,'');
		var cururl = window.location.href.replace(/^https?:/,'');
		if( (whref.indexOf("&menu_id=")>0 && t_href.indexOf("id=")>0 && whref.indexOf(t_href)>-1) || t_href == sethomeurl &&  sethomeurl.indexOf(cururl)>-1 ){
			t_bool = true;
		}

		if(whref == t_href || whref== t_href+"&brd=1" || t_bool){ $(this).addClass("lihover").children('a').addClass("ahover"); }
		n++;
	});
	if(!$('#nav_'+layer_id+'').children('li.lihover').length){
		$('#nav_'+layer_id+'').children('li.rootlihover:first').addClass("lihover").children('a').addClass("ahover");
	}
	$('#nav_'+layer_id+' .rootlihover').removeClass('rootlihover');
}
function wp_nav_addMoreButton(layer_id)
{  
	var type_style=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
	
	var index=0;
	var func=function(){
		if(!$('#scroll_container #'+layer_id+':visible').length){
			if(index<=20){
				setTimeout(func,500);
				index++;
			}
			return;
		}

		var firstLiTop = 0;
		var hasMore = false;
		$('#scroll_container  #nav_'+layer_id).children('li.wp_subtop').each(function(i){
			if(i == 0) {firstLiTop = $(this).offset().top;return true;}	
			if($(this).offset().top > firstLiTop)
			{
				if(i==1){
					var twice=$("#"+layer_id).data('twiced');
					if(!twice){
						$("#"+layer_id).data('twiced',true);
						setTimeout(func,1500);
						return false;
					}
				}	

				if(type_style==2){
					$(this).remove();
				}else{

				$('#'+layer_id).data('hasMore','yes');//配置逻辑获取
				var more = $.trim($('#'+layer_id).children('.wp-new_navigation_content').children('.nav1').attr('more'));
				var doms = $(this).prev().prev().nextAll().clone();
				var objA = $(this).prev().children('a');
				if(objA.children('span').length > 0) objA.children('span').html(more);
				else objA.html(more);

				if(objA.hasClass('sub'))
				{
					objA.next('ul').empty();
					doms.appendTo(objA.next('ul'));
				}
				else
				{
					objA.after('<ul></ul>');
					doms.appendTo(objA.next('ul'));
					objA.addClass('sub');
				}
				objA.addClass('nav_more_link');
				$(this).prev().nextAll().remove();
				objA.next('ul').children('li').removeClass('wp_subtop').removeClass('lihover').children('a').removeClass("ahover");
				hasMore = true;
				
				objA.attr('href','javascript:void(0);');

				//点击"更多"弹出全站导航
				if($("#"+layer_id).find('.nav1').attr('moreshow') == 1)
				{
					$(document).undelegate("#"+layer_id+" .nav_more_link",'click').delegate("#"+layer_id+" .nav_more_link",'click',function (e){
						var func=function(){
							$('#'+layer_id).find('#basic-modal-content_'+layer_id).modal({
								containerId:'wp-new_navigation-simplemodal-container_'+layer_id,
								zIndex:9999,
								close:false,
								onOpen:function(dialog){
									dialog.overlay.fadeIn('slow', function(){
										dialog.container.slideDown('slow',function(){
											dialog.data.fadeIn('slow','swing',function(){
												$('.wp_menus').not('.wp_thirdmenu0').each(function(){
													var left = $(this).parent().parent().children('a').eq(0).outerWidth()+5;
													$(this).css({position:'relative',left:left+'px'});
												});
											});
										});
									});
								},
								onClose:function(dialog){
									dialog.data.fadeOut('slow',function (){
										dialog.container.slideUp('slow', function () {
											dialog.overlay.fadeOut('slow', function () {
												$.modal.close();
											});
										});
									});
								}
							});
						}
						if($('#'+layer_id).find('#basic-modal-content_'+layer_id).length){
							func();
						}else{
							var morediv=$('#'+layer_id).find('.navigation_more');
							var more_color=morediv.attr('data-more');
							var typeval=morediv.attr('data-typeval');
							var menudata=morediv.attr('data-menudata');
							$.ajax({
								type: "POST",
								url: parseToURL("new_navigation", "windowpopup"),
								data: {layer_id:layer_id,color:more_color,typeval:typeval,menudata:menudata},
								success: function (response) {
									if (response == 'Session expired')
										window.location.href = getSessionExpiredUrl();
									morediv.replaceWith(response);
									func();
								},
								error: function (xhr, textStatus, errorThrown) {
									wp_alert(xhr.readyState + ',' + xhr.status + ' - ' + (errorThrown || textStatus) + "(get nav).<br/>" + translate("Request failed!"));
									return false;
								}
							});
						}
						return false;
					});
				
				}
				return false;
				}
			}
		});
		if(!hasMore) $('#'+layer_id).data('hasMore','no');
		wp_showdefaultHoverCss(layer_id);
	};
	func();
}

//编辑模式水平拖动动态刷新修改More按钮
function wp_updateMoreButton(layer_id)
{
	var $layer = $('#'+layer_id);
	var $nav1 = $layer.children('.wp-new_navigation_content').children('.nav1');
	var tmp_css = $.trim($("#datastys_"+layer_id).text());
	var tmp_cssa = $.trim($("#datasty_"+layer_id).text()); 
	$.post(parseToURL("new_navigation","refreshNavigator",{menustyle:$.trim($nav1.attr('skin')),saveCss:'yes',page_id:$("#page_id").val(),blockid:layer_id,typeval:$.trim($layer.find(".wp-new_navigation_content").attr('type')),colorstyle:$.trim($nav1.attr('colorstyle')),direction:$.trim($nav1.attr('direction')),more:$.trim($nav1.attr('more')),hover:$.trim($nav1.attr('hover')),hover_scr:$.trim($nav1.attr('hover_scr')),umenu:$.trim($nav1.attr('umenu')),dmenu:$.trim($nav1.attr('dmenu')),moreshow:$.trim($nav1.attr('moreshow')),morecolor:$.trim($nav1.attr('morecolor'))}),{"addopts": $layer.mod_property("addopts")||{},menudata:$("#"+layer_id).data("menudata")},function(data){
		$layer.find('.wp-new_navigation_content').html(data);		
		$("#datastys_"+layer_id).text(tmp_css);
		get_plugin_css(layer_id,tmp_cssa+" "+tmp_css);
	});
	wp_showdefaultHoverCss(layer_id);
}

function wp_removeLoading(layer_id)
{
	
	var $nav1 = $('#'+layer_id).find(".nav1");
	var ishorizon=$nav1.attr("ishorizon");
	if(ishorizon=='1'){
		$("#"+layer_id).find('.wp-new_navigation_content').css({height:'auto',overflow:'hidden'});
	}else{
		$("#"+layer_id).find('.wp-new_navigation_content').css({width:'auto',overflow:'hidden'});
	}
	// 修复IE浏览器部分版本导航无法显示问题 2013/12/26
 
	var temptimer = setTimeout(function(){
		$("#"+layer_id).find('.wp-new_navigation_content').css("overflow", 'visible');
		clearTimeout(temptimer);
	}, 50);
}

function richtxt(layer_id)
{
	var type=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
	if(type==2){
		var baseloop = 0;
		 $("#"+layer_id).find('.ddli').each(function(){
			 $(this).addClass("setdiff"+baseloop);
			 baseloop++;
		 });
	}
}

function wp_createNavigationgetSubMenuHoverCssFunc(param){
	var layer_id=param.layer_id;
	var editmode=param.editmode;
	function getSubMenuHoverCss(css_pro,type){
		var typeval=type;
		if(typeval==1){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else{
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}
		if(editmode){
			var navStyle = $.trim($("#datastys_"+layer_id).text());
		}else{
			var navStyle = $.trim($("#"+layer_id).data("datastys_"));
		}
		if(navStyle.length > 0){
			var patt1 =new RegExp(regex,'i');
			var tmp = patt1.exec($.trim(navStyle));
			if(tmp)
			{
				return $.trim((tmp[0].match(/{[^:]+:[^;]+/)[0]).match(/:[^;]+/)[0].replace(':',''));
			}
		}
		if(editmode){
			navStyle = $.trim($("#datasty_"+layer_id).text());
		}else{
			navStyle = $.trim($("#"+layer_id).data("datasty_"));
		}
		if(navStyle.length > 0)
		{
			if(typeval==1){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{[^}]+}",'i');
			}else{
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
			}
			var tmp = patt1.exec(navStyle);

			if(tmp)
			{
				var tmp1 = tmp[0].match(/{[^}]+}/)[0];
				var patt2 = new RegExp(css_pro+"\\s*:\\s*[^;]+;",'i');
				tmp = patt2.exec(tmp1);
				if(tmp) return $.trim(tmp[0].replace(/[^:]+:/,'').replace(';',''));
			}
		}
		return $.trim($("#nav_"+layer_id+" ul li a").css(css_pro));
	}
	window[layer_id+'_getSubMenuHoverCss']=getSubMenuHoverCss;
}

function layer_new_navigation_content_func(params){
	var layer_id = params['layer_id'];
	$("#"+layer_id).find('.menu_hs11').css('visibility','hidden');
    var contentfunc=function(){
        if($("#"+layer_id).is(':visible')){
                $("#"+layer_id).find('.wp-new_navigation_content').each(function(){
                  var wid = $(this).width();
                  var liwid = $(this).find('li:eq(0)');
                  var lipadd = parseInt(liwid.css('padding-right'))+parseInt(liwid.css('padding-left'));
                                    if ($.inArray(params.menustyle, ['hs7','hs9','hs11','hs12']) != -1) {
                      var bwidth = parseInt(liwid.css("borderRightWidth") || '0');
                      if(bwidth > 0) $('li.wp_subtop', this).width(function(i, h){return h - bwidth - 1});
                  }
                  if(parseInt(liwid.width())>(wid-lipadd)){
                    $(this).find('li.wp_subtop').css('width',wid-lipadd);
                  }
                });
                $("#"+layer_id).find('.menu_hs11,.menu_hs7,.menu_hs12').css('visibility','');
                var contenth=$("#"+layer_id+" .wp-new_navigation_content").height();
                if(contenth==0){
                    $("#"+layer_id+" .wp-new_navigation_content").css('height','');
                }
         }else{
                 setTimeout(contentfunc,60);
         }
    }
	contentfunc();
		if(params.isedit){$('#'+layer_id).mod_property({"addopts": params.addopts});}
	if((params.addopts||[]).length > 0 && /^hs/i.test(params.menustyle)){$('#nav_'+layer_id+' li.wp_subtop:last').css("border-right", 'none');}
    if(! params.isedit){
        if($.inArray(params.menustyle, ['vertical_vs6','vertical_vs7']) != -1){
            var $layer=$('#'+layer_id).find(".wp-new_navigation_content");
            var vswidth=$layer.width();
            var $ul=$layer.find('ul.navigation');
            $ul.css({width:vswidth+'px'});
            $ul.find("li.wp_subtop").css({width:(vswidth-14)+'px'});
        }
    }
};
function layer_new_navigation_hs9_func(params){
	var layer_id = params['layer_id'],
	menustyle = params.menustyle;
	window[layer_id+'_liHoverCallBack'] = function(){
		$(".menu_"+menustyle+" #nav_"+layer_id+" li").hover(function(){
			if(params.isedit){
				var resizehandle = parseInt($('#'+layer_id).children('.ui-resizable-handle').css('z-index'));
				if($(this).hasClass('wp_subtop')) $(this).parent().css('z-index',resizehandle+1);
				var canvas_zindex = $('#canvas').css('z-index');
				var $toolbar = $(".propblk[super='"+layer_id+"']");
				if($toolbar.length > 0)  $toolbar.css('z-index',canvas_zindex - 1);
			}
			$(this).children("ul").css("left", "0px").show();
		},function(){
			$(this).children("ul").hide();

			if(params.isedit){
				var resizehandle = parseInt($('#'+layer_id).children('.ui-resizable-handle').css('z-index'));
				var isHover = true;
				$('#nav_'+layer_id).find('ul').each(function(){
					if($(this).css('display') != 'none') isHover = false;
					return false;
				});
				if(isHover){
					if(!($.browser.msie && $.browser.version < 9)) $(this).parent().css('z-index',resizehandle-1);
				}				
			}

		});

	};
	
	window[layer_id+'_getSubMenuHoverCss'] = function(css_pro,type){
		var typeval=type;
		if(typeval==1){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else if(typeval == 2){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul\\s+li\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else if(typeval == 3){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul\\s+li\\s*:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}
		else{
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}
		
		var navStyle = wp_get_navstyle(layer_id, 'datastys_');
		if(navStyle.length > 0)
		{
			var patt1 =new RegExp(regex,'i');
			var tmp = patt1.exec($.trim(navStyle));
			if(tmp)
			{
				return $.trim((tmp[0].match(/{[^:]+:[^;]+/)[0]).match(/:[^;]+/)[0].replace(':',''));
			}
		}
		navStyle = wp_get_navstyle(layer_id, 'datasty_');
		if(navStyle.length > 0)
		{
			if(typeval==1){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{[^}]+}",'i');
			}else if(typeval == 2){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul\\s+li\\s*{[^}]+}",'i');
			}else if(typeval == 3){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul\\s+li\\s*:\\s*hover\\s*{[^}]+}",'i');
			}else{
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
			}
			var tmp = patt1.exec(navStyle);
			
			if(tmp)
			{
				var tmp1 = tmp[0].match(/{[^}]+}/)[0];
				var patt2 = new RegExp(css_pro+"\\s*:\\s*[^;]+;",'i');
				tmp = patt2.exec(tmp1);
				if(tmp) return $.trim(tmp[0].replace(/[^:]+:/,'').replace(';',''));
			}
		}

		return $.trim($("#nav_"+layer_id+" ul li a").css(css_pro));
	};
	
	$('#'+layer_id).layer_ready(function(){
		window[layer_id+'_liHoverCallBack']();

		//第三级即下级菜单随高度增加位置动态修改
		$('#'+layer_id+' .menu_'+menustyle+' li').hover(function(){
			$(this).children('ul').css('top',$(this).outerHeight());
		});
		
		$("#"+layer_id+" li").hover(function(){ 			
				var thisleft=$(this).offset().left;
				var thiswidth=$(this).outerWidth();	
				//父中心点坐标
				var thiswidthcenter=0;
				//子中心点坐标
				var thischildwidthcenter=0;			
				var orgleft = $("#"+layer_id).offset().left;
				var orgright = $("#"+layer_id).outerWidth();
				orgright=orgright+orgleft;
				thiswidthcenter=thisleft+thiswidth/2;

				//计算子菜单总宽度
				var childlidom=$(this).children('ul').children('li');
				var childliwidth=0;
				childlidom.each(function(){
					childliwidth=childliwidth+$(this).outerWidth();			
				});
				
				thischildwidthcenter=childliwidth/2;			
				var chavalue=thiswidthcenter-thischildwidthcenter;
				var charightvalue=thiswidthcenter+thischildwidthcenter;			
				
				var ulwidth=$("#"+layer_id).width();
				if(chavalue<orgleft && charightvalue>orgright){ 
					//超出边界不做处理			
				}else{
					if(chavalue>orgleft && charightvalue<orgright){
						$(this).children("ul:eq(0)").css("padding-left", (chavalue-orgleft)+"px");				
						if(ulwidth>0){
							$(this).children("ul:eq(0)").css("width", (ulwidth-chavalue+orgleft)+"px");
						}	
					}else{
						if(chavalue>orgleft && charightvalue>orgright){
							$(this).children("ul:eq(0)").css("padding-left", (ulwidth-childliwidth-2)+"px");
							if(ulwidth>0){
								if(childliwidth>ulwidth) childliwidth=ulwidth;
								$(this).children("ul:eq(0)").css("width", (childliwidth+2)+"px");
							}
						}
					}		
				}
				
				if(!$(this).hasClass('wp_subtop'))
				{
					$(this).css('background-image',window[layer_id+'_getSubMenuHoverCss']('background-image',3));
					$(this).css('background-repeat',window[layer_id+'_getSubMenuHoverCss']('background-repeat',3));
					$(this).css('background-color',window[layer_id+'_getSubMenuHoverCss']('background-color',3));
					$(this).css('background-position',window[layer_id+'_getSubMenuHoverCss']('background-position',3));
				}
				if($(this).children('ul').length > 0)
				{
					$(this).children('ul').css('background-image',window[layer_id+'_getSubMenuHoverCss']('background-image',2));
					$(this).children('ul').css('background-repeat',window[layer_id+'_getSubMenuHoverCss']('background-repeat',2));
					$(this).children('ul').css('background-color',window[layer_id+'_getSubMenuHoverCss']('background-color',2));
					$(this).children('ul').css('background-position',window[layer_id+'_getSubMenuHoverCss']('background-position',2));

					$(this).children('ul').children('li').css({'background-image':'none','background-color':'transparent'});
				}
				var type=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
				if(type==2){
					var self = $(this);
					var pos = 0 ;
					var loops = 0;
					$('#nav_'+layer_id).find('li').each(function(){
						if(loops == 1) return true;
						if(self.html() == $(this).html()){
							loops = 1;
							return true;
						}else{
							pos = pos + $(this).outerWidth();
						}	
						 
					})
					 
					$("#"+layer_id).find('.ddli').hide();
					var this_width = $('#nav_'+layer_id).outerWidth();
					var thisul_left = $('#nav_'+layer_id).css("padding-left");
					thisul_left = parseInt(thisul_left);
					$(this).children('.ddli').outerWidth(this_width).css("margin-left","-"+(thisul_left+pos)+"px");
					$(this).children('.ddli').eq(0).slideDown();
				}			
	 
		},function(){ 
				if(!$(this).hasClass('wp_subtop'))
				$(this).css({'background-color':'transparent','background-image':'none'});
				$(this).children("ul:eq(0)").css("left", "-99999px").hide(); 
				if(params.isedit){
					var isHover=true;
					$('#nav_'+layer_id).find('ul').each(function(){
						if($(this).css('display') != 'none') {isHover = false;}
					});
					if(isHover){			 
						var $toolbar = $(".propblk[super='"+layer_id+"']");
						if($toolbar.length > 0)  $toolbar.css('z-index','999');
					}	
				}
				var type=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
				if(type==2){
					$("#"+layer_id).find('.ddli').slideUp();
				}
		});

		$('.menu_'+menustyle+' #nav_'+layer_id).find('li').hover(function(){
			var direction=$("#"+layer_id).find('.nav1').attr('direction');
			var height = parseInt($(this).outerHeight());
			if(direction==1){				
				$(this).children('ul').css('top','auto').css('bottom',height + 'px');
			}else{				
				$(this).children('ul').css('top',height+'px').css('bottom','auto');	
			}
			if($(this).parent().hasClass('navigation'))
			{			
				$(this).children('a').css({'font-family':window[layer_id+'_getSubMenuHoverCss']("font-family",0),'font-size':window[layer_id+'_getSubMenuHoverCss']("font-size",0),'color':window[layer_id+'_getSubMenuHoverCss']("color",0),'font-weight':window[layer_id+'_getSubMenuHoverCss']("font-weight",0),'font-style':window[layer_id+'_getSubMenuHoverCss']("font-style",0)});
			}else{			
				$(this).children('a').css({'font-family':window[layer_id+'_getSubMenuHoverCss']("font-family",1),'font-size':window[layer_id+'_getSubMenuHoverCss']("font-size",1),'color':window[layer_id+'_getSubMenuHoverCss']("color",1),'font-weight':window[layer_id+'_getSubMenuHoverCss']("font-weight",1),'font-style':window[layer_id+'_getSubMenuHoverCss']("font-style",1)});
			}
			if($(this).parent().hasClass('navigation'))
			{
				$('#nav_'+layer_id+' .wp_subtop').removeClass("lihover").children('a').removeClass("ahover");
			}
		},function(){
			if($(this).parent().hasClass('navigation'))
			{
				wp_showdefaultHoverCss(layer_id);
			}
			 $(this).children('a').attr("style",'');
		});
		wp_showdefaultHoverCss(layer_id);
		var is_exec=false;
		var func=function(){
			if(!is_exec){
				wp_removeLoading(layer_id);
				is_exec=true;
			}
		};
		$(function(){
			func();
		});
		
	});
};
(function($){

	var patterns = {
		text: /^['"]?(.+?)["']?$/,
		url: /^url\(["']?(.+?)['"]?\)$/
	};

	function clean(content) {
		if(content && content.length) {
			var text = content.match(patterns.text)[1],
				url = text.match(patterns.url);
			return url ? '<img src="' + url[1] + '" />': text;
		}
	}

	function inject(prop, elem, content) {
		if(prop != 'after') prop = 'before';
		if(content = clean(elem.currentStyle[prop])) {
			$(elem)[prop == 'before' ? 'prepend' : 'append'](
				$(document.createElement('span')).addClass(prop).html(content)
			);
		}
	}

	$.pseudo = function(elem) {
		inject('before', elem);
		inject('after', elem);
		elem.runtimeStyle.behavior = null;
	};
	
	if(document.createStyleSheet) {
		var o = document.createStyleSheet(null, 0);
		o.addRule('.dummy','display: static;');
		o.cssText = 'html, head, head *, body, *.before, *.after, *.before *, *.after * { behavior: none; } * { behavior: expression($.pseudo(this)); }';
	}

})(jQuery);;
function layer_new_navigation_vs3_func(params){
	var layer_id = params['layer_id'];
	window[layer_id+'_getSubMenuHoverCss'] = function(css_pro,type){
		var typeval=type;
		if(typeval==1){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else{
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}
	 
		var navStyle = wp_get_navstyle(layer_id, 'datastys_');
		if(navStyle.length > 0)
		{
			var patt1 =new RegExp(regex,'i');
			var tmp = patt1.exec($.trim(navStyle));
			if(tmp)
			{
				return $.trim((tmp[0].match(/{[^:]+:[^;]+/)[0]).match(/:[^;]+/)[0].replace(':',''));
			}
		}
		navStyle = wp_get_navstyle(layer_id, 'datasty_');
		if(navStyle.length > 0)
		{
			if(typeval==1){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{[^}]+}",'i');
			}else{
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
			}
			var tmp = patt1.exec(navStyle);
			
			if(tmp)
			{
				var tmp1 = tmp[0].match(/{[^}]+}/)[0];
				var patt2 = new RegExp(css_pro+"\\s*:\\s*[^;]+;",'i');
				tmp = patt2.exec(tmp1);
				if(tmp) return $.trim(tmp[0].replace(/[^:]+:/,'').replace(';',''));
			}
		}

		return $.trim($("#nav_"+layer_id+" ul li a").css(css_pro));
	};
	
	$(function () {
		$('#nav_'+layer_id).find('li').hover(function(){
			if(params.isedit){
				var resizehandle = parseInt($('#'+layer_id).children('.ui-resizable-handle').css('z-index'));
				if($(this).hasClass('wp_subtop')) $(this).parent().css('z-index',resizehandle+1);
			}
			$(this).children('ul').show();
			var type=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
			if(type==2){
				var self = $(this);
				var this_width = self.outerWidth();  	
				$(this).children('.ddli').css("margin-left",(this_width-10)+"px");
				$("#"+layer_id).find('.ddli').hide();			
				$(this).children('.ddli').eq(0).slideDown();
			}
		},function(){
			$(this).children('ul').hide();
			if(!($.browser.msie && $.browser.version < 9)){
				if(params.isedit){
					var resizehandle = parseInt($('#'+layer_id).children('.ui-resizable-handle').css('z-index'));
					var isHover = true;
					$('#nav_'+layer_id).find('ul').each(function(){
						if($(this).css('display') != 'none') {isHover = false;return false;}
					});
					if(isHover) $(this).parent().css('z-index',resizehandle-1);
				}
			}
			var type=$("#"+layer_id).find('.wp-new_navigation_content').attr('type');
			if(type==2){
				$("#"+layer_id).find('.ddli').slideUp();
			}
		});

		var ulheight = 0;
		$("#nav_"+layer_id).find('li.wp_subtop').each(function(){
			ulheight += $(this).outerHeight() + parseInt($(this).css('margin-bottom'));
		});
		$("#nav_"+layer_id).height(ulheight);
		//bug #2944
		if (!!window.ActiveXObject || "ActiveXObject" in window){
			var layer_height=parseInt($("#"+layer_id).css('height'));
			if(layer_height<parseInt(ulheight)){
				$("#"+layer_id).height(ulheight);
				$("#"+layer_id).find('.wp-new_navigation_content').height(ulheight);
			}
		}

		$("#nav_"+layer_id).find('li').hover(function(){
			$(this).children('ul').css('margin-left',$(this).outerWidth()+'px');
			$(this).children('ul').css('margin-top',-1*$(this).outerHeight()+4+'px');
		});
		
		$('.menu_'+params.menustyle+' #nav_'+layer_id).find('li').hover(function(){
			var direction=$("#"+layer_id).find('.nav1').attr('direction');
			var width = parseInt($(this).outerWidth());
			if(params.isedit){
				$('.posblk[super="'+layer_id+'"]').hide();
			}
			if(direction==1){				
				$(this).children('ul').css('left','auto').css('right',(width)+'px').css("padding-right","3px");
			}else{
				$(this).children('ul').css('left','0px').css('right','auto');	
			}	
			if($(this).parent().hasClass('navigation'))
			{
				$('#nav_'+layer_id+' .wp_subtop').removeClass("lihover").children('a').removeClass("ahover");
				$(this).children('a').css({'font-family':window[layer_id+'_getSubMenuHoverCss']("font-family",0),'font-size':window[layer_id+'_getSubMenuHoverCss']("font-size",0),'color':window[layer_id+'_getSubMenuHoverCss']("color",0),'font-weight':window[layer_id+'_getSubMenuHoverCss']("font-weight",0),'font-style':window[layer_id+'_getSubMenuHoverCss']("font-style",0)});
			}else{
				$(this).children('a').css({'font-family':window[layer_id+'_getSubMenuHoverCss']("font-family",1),'font-size':window[layer_id+'_getSubMenuHoverCss']("font-size",1),'color':window[layer_id+'_getSubMenuHoverCss']("color",1),'font-weight':window[layer_id+'_getSubMenuHoverCss']("font-weight",1),'font-style':window[layer_id+'_getSubMenuHoverCss']("font-style",1)});
			}
		},function(){
			if($(this).parent().hasClass('navigation'))
			{
				wp_showdefaultHoverCss(layer_id);
			}
			 $(this).children('a').attr("style",'');
				
		});
		wp_showdefaultHoverCss(layer_id);
		wp_removeLoading(layer_id);
	});
};
var jeditMode = 0;
function layer_prdcat_setvar(params){
    jeditMode = params.isedit;
    if(jeditMode){
        $(function(){
            $("#"+params.layerid+" li a").removeAttr('onclick').click(function(){return false;});
        });
    }
}

function wp_getdefaultHoverCss(layer_id)
{
	var getli='';
	var geta='';
	var cssstyle='';
 
	if(jeditMode){
	var navStyle = $.trim($("#datasty_"+layer_id).text());
	}else{
	var navStyle = $.trim($("#"+layer_id).data("datasty_"));
	}
	if(navStyle.length > 0)
	{
		var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop:\\s*hover\\s*{[^}]+}",'i');
		var tmp = patt1.exec(navStyle);
		if(tmp)
		{			
			var tmp1 = tmp[0].match(/{[^}]+}/)[0];
			tmp1=tmp1.replace('{','').replace('}','');
			getli=getli+tmp1;
		}
 
		patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
		tmp = patt1.exec(navStyle);
		if(tmp)
		{			
			var tmp2 = tmp[0].match(/{[^}]+}/)[0];
			tmp2=tmp2.replace('{','').replace('}','');
			geta=geta+tmp2;
		}		
		
		
	}
	if(jeditMode){
	navStyle = $.trim($("#datastys_"+layer_id).text());
	}else{
	navStyle = $.trim($("#"+layer_id).data("datastys_"));
	}
 
	var getlia='';
	if(navStyle.length > 0)
	{		 
		var layidlow=('#nav_'+layer_id+' li.wp_subtop>a:hover').toLowerCase();
		if( ('a'+navStyle).toLowerCase().indexOf(layidlow)>0){			
			var parstr="#nav_"+ layer_id +" li.wp_subtop>a:hover";
			getlia = navStyle.split(new RegExp(parstr,"i"));
			var combilestr='';
			for(key in getlia){
				var ervervalue='';				
				if(('a'+getlia[key]).indexOf('{')<3 && ('a'+getlia[key]).indexOf('{')>0 ){
					var parvalue=getlia[key].split('{');
					if(('a'+parvalue[1]).indexOf('}')>0){
						ervervalue=parvalue[1].split('}')[0];
					}
				}
				combilestr=combilestr+ervervalue;
			}
			geta=geta+combilestr;
		}
		
		layidlow=('#nav_'+layer_id+' li.wp_subtop:hover').toLowerCase();
		if( ('a'+navStyle).toLowerCase().indexOf(layidlow)>0){			
			var parstr="#nav_"+ layer_id +" li.wp_subtop:hover";
			getlia = navStyle.split(new RegExp(parstr,"i"));
			var combilestrs='';
			for(key in getlia){
				var ervervalue='';				
				if(('a'+getlia[key]).indexOf('{')<3 && ('a'+getlia[key]).indexOf('{')>0 ){
					var parvalue=getlia[key].split('{');
					if(('a'+parvalue[1]).indexOf('}')>0){
						ervervalue=parvalue[1].split('}')[0];
					}
				}
				combilestrs=combilestrs+ervervalue;
			}
			getli=getli+combilestrs;
		}
	 
		
	}
	
	if(getli.length>0){
		getli="#"+layer_id+" li.lihover{"+getli+"} ";
	}
	if(geta.length>0){
		geta="#"+layer_id+" li>a.ahover{"+geta+"} ";
	}
	cssstyle=getli+geta;
	if(cssstyle.length>0){
		cssstyle=""+cssstyle+"";
		cssstyle=cssstyle.replace(/[\r\n]/g, " ").replace(/\s+/g, " "); 
          var doms=$('#'+layer_id);
		var oldcssstyle=doms.data('get_layer_hover_css');
         if(oldcssstyle != cssstyle){
                if(jeditMode){
                $("#hover"+layer_id+"").text(""+cssstyle+"");
                }
                doms.data('get_layer_hover_css',cssstyle);
                get_plugin_css('H'+layer_id+'H',cssstyle);
         }
	}
}

function wp_createNavigationgetSubMenuHoverCssFunc(param){
	var layer_id=param.layer_id;
	var editmode=param.editmode;
	function getSubMenuHoverCss(css_pro,type){
		var typeval=type;
		if(typeval==1){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else{
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}
		if(editmode){
			var navStyle = $.trim($("#datastys_"+layer_id).text());
		}else{
			var navStyle = $.trim($("#"+layer_id).data("datastys_"));
		}
		if(navStyle.length > 0){
			var patt1 =new RegExp(regex,'i');
			var tmp = patt1.exec($.trim(navStyle));
			if(tmp)
			{
				return $.trim((tmp[0].match(/{[^:]+:[^;]+/)[0]).match(/:[^;]+/)[0].replace(':',''));
			}
		}
		if(editmode){
			navStyle = $.trim($("#datasty_"+layer_id).text());
		}else{
			navStyle = $.trim($("#"+layer_id).data("datasty_"));
		}
		if(navStyle.length > 0)
		{
			if(typeval==1){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{[^}]+}",'i');
			}else{
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
			}
			var tmp = patt1.exec(navStyle);

			if(tmp)
			{
				var tmp1 = tmp[0].match(/{[^}]+}/)[0];
				var patt2 = new RegExp(css_pro+"\\s*:\\s*[^;]+;",'i');
				tmp = patt2.exec(tmp1);
				if(tmp) return $.trim(tmp[0].replace(/[^:]+:/,'').replace(';',''));
			}
		}
		return $.trim($("#nav_"+layer_id+" ul li a").css(css_pro));
	}
	window[layer_id+'_getSubMenuHoverCss']=getSubMenuHoverCss;
}

function wp_showdefaultHoverCss(layer_id){
	var layertype=$('#'+layer_id).attr('type');
	if(layertype && window['wp_showdefaultHoverCss_'+layertype]){
		return window['wp_showdefaultHoverCss_'+layertype](layer_id);
	}
	return false;
}

function wp_showdefaultHoverCss_product_category(layer_id)
{
	var plugin_name=$("#"+layer_id).attr('type');
	var hover=$("#"+layer_id).find('.nav1').attr('hover');
	if(hover!=1){ return;}
	
	wp_getdefaultHoverCss(layer_id);
	var n=0;
	
	if(plugin_name=='new_navigation'){
		var page_id=$("#page_id").val();
                var rootpid=$("#page_id").attr("rpid")*1;
	}else{
		var page_id=$('#'+layer_id+'').find(".default_pid").html();
		if(page_id==0 || page_id.length==0){
			page_id=$('#nav_'+layer_id+'').children('li:first').attr('pid');	
		}
	}
	$('#nav_'+layer_id+'').children('li').each(function(){
		var type_pid=$(this).attr('pid');		
		if(type_pid==page_id){
			$(this).addClass("lihover").children('a').addClass("ahover");
		}else if(type_pid==rootpid){
                    $(this).addClass("lihover").children('a').addClass("ahover");
                }
		if(window.location.href == $(this).find("a").attr("href") || window.location.href == $(this).find("a").attr("href")+"&brd=1"){ $(this).addClass("lihover").children('a').addClass("ahover"); }
		n++;
	});
	if(!$('#nav_'+layer_id+'').children('li.lihover').length){
		$('#nav_'+layer_id+' ul').children('li').each(function(){
			var lochref=window.location.href.replace(/^https?:/,'').replace(/&brd=1$/,'');
			var subahref= $(this).find('a').attr("href").replace(/^https?:/,'').replace(/&brd=1$/,'');
			if(lochref == subahref || lochref ==subahref+"&brd=1"){ 
				$(this).parents(".wp_subtop").addClass("lihover").children('a').addClass("ahover"); 
				return;
			}
		})
	}

}

function wp_addMoreButton(layer_id){
	var layertype=$('#'+layer_id).attr('type');
	if(layertype && window['wp_addMoreButton_'+layertype]){
		return window['wp_addMoreButton_'+layertype](layer_id);
	}
	return false;
}

function wp_addMoreButton_product_category(layer_id)
{
	var firstLiTop = 0;
	var hasMore = false;
	$('#nav_'+layer_id).children('li.wp_subtop').each(function(i){
		if(i == 0) {firstLiTop = $(this).offset().top;return true;}	
		if($(this).offset().top > firstLiTop)
		{
			$('#'+layer_id).data('hasMore','yes');//配置逻辑获取
			var more = $.trim($('#'+layer_id).children('.wp-product_category_content').children('.nav1').attr('more'));
			var doms = $(this).prev().prev().nextAll().clone();
			var objA = $(this).prev().children('a');
			if(objA.children('span').length > 0) objA.children('span').html(more);
			else objA.html(more);

			if(objA.hasClass('sub'))
			{
				objA.next('ul').empty();
				doms.appendTo(objA.next('ul'));
			}
			else
			{
				objA.after('<ul></ul>');
				doms.appendTo(objA.next('ul'));
				objA.addClass('sub');
			}
				
			$(this).prev().nextAll().remove();
			objA.next('ul').children('li').removeClass('wp_subtop');
			hasMore = true;

			objA.attr('href','javascript:void(0);');
			
			//点击"更多"弹出全站导航
			if($("#"+layer_id).find('.nav1').attr('moreshow') == 1)
			{
				objA.click(function (e){
					$('#'+layer_id).find('#basic-modal-content_'+layer_id).modal({
						containerId:'wp-product_category-simplemodal-container_'+layer_id,
						zIndex:9999,
						close:false,
						onOpen:function(dialog){
							dialog.overlay.fadeIn('slow', function(){
								dialog.container.slideDown('slow',function(){
									dialog.data.fadeIn('slow','swing',function(){
										$('.wp_menus').not('.wp_thirdmenu0').each(function(){
											var left = $(this).parent().parent().children('a').eq(0).outerWidth()+5;
											$(this).css({position:'relative',left:left+'px'});
										});
									});
								});
							});
						},
						onClose:function(dialog){
							dialog.data.fadeOut('slow',function (){
								dialog.container.slideUp('slow', function () {
									dialog.overlay.fadeOut('slow', function () {
										$.modal.close();
									});
								});
							});
						}
					});
					return false;
				});
			}
			return false;
		}
	});
	if(!hasMore) $('#'+layer_id).data('hasMore','no');
	wp_showdefaultHoverCss(layer_id);
}

//编辑模式水平拖动动态刷新修改More按钮
function wp_updateMoreButton(layer_id)
{
	var $layer = $('#'+layer_id);
	var $nav1 = $layer.children('.wp-product_category_content').children('.nav1');
	var tmp_css = $.trim($("#datastys_"+layer_id).text());
	var tmp_cssa = $.trim($("#datasty_"+layer_id).text());
	$.post(parseToURL("product_category","refreshNavigator",{menustyle:$.trim($nav1.attr('skin')),saveCss:'yes',page_id:$("#page_id").val(),blockid:layer_id,typeval:$.trim($layer.find(".wp-product_category_content").attr('type')),colorstyle:$.trim($nav1.attr('colorstyle')),direction:$.trim($nav1.attr('direction')),more:$.trim($nav1.attr('more')),hover:$.trim($nav1.attr('hover')),moreshow:$.trim($nav1.attr('moreshow')),morecolor:$.trim($nav1.attr('morecolor'))}),function(data){
		$layer.find('.wp-product_category_content').html(data);
		$("#datastys_"+layer_id).text(tmp_css);
 					
		var setcss=$("#page_set_css").html();
		setcss=setcss.replace(/<style>/i,'').replace(/<\/style>/i,'');
		var reg=new RegExp("(.*)([/][/*]"+layer_id+"[/*][/])(.*)([/][/*]"+layer_id+"[/*][/])(.*)","gmi");
		var url=setcss;
		var rep=url.replace(reg,"$1 $5");
		var tempcss=rep + " /*"+ layer_id +"*/ "+tmp_cssa+" "+tmp_css+" /*"+ layer_id +"*/ ";
		tempcss = tempcss.replace(/[\r\n]/g, " ").replace(/\s+/g, " "); 
		$("#page_set_css").html('<style> '+tempcss+ '</style>');
	});
	wp_showdefaultHoverCss(layer_id);
}


function wp_removeLoading(layer_id)
{
	
	var $nav1 = $('#'+layer_id).find(".nav1");
	var ishorizon=$nav1.attr("ishorizon");
	if(ishorizon=='1'){
		$("#"+layer_id).find('.wp-new_navigation_content').css({height:'auto',overflow:'hidden'});
	}else{
		$("#"+layer_id).find('.wp-new_navigation_content').css({width:'auto',overflow:'hidden'});
	}
	// 修复IE浏览器部分版本导航无法显示问题 2013/12/26
 
	var temptimer = setTimeout(function(){
		$("#"+layer_id).find('.wp-new_navigation_content').css("overflow", 'visible');
		clearTimeout(temptimer);
	}, 50);
};
function wp_getdefaultHoverCss(layer_id)
{
	var getli='';
	var geta='';
	var cssstyle='';

	var navStyle = wp_get_navstyle(layer_id,'datasty_');
 
	if(navStyle.length > 0)
	{
		var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop:\\s*hover\\s*{[^}]+}",'i');
		var tmp = patt1.exec(navStyle);
		if(tmp)
		{			
			var tmp1 = tmp[0].match(/{[^}]+}/)[0];
			tmp1=tmp1.replace('{','').replace('}','');
			getli=getli+tmp1;
		}
 
		patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
		tmp = patt1.exec(navStyle);
		if(tmp)
		{			
			var tmp2 = tmp[0].match(/{[^}]+}/)[0];
			tmp2=tmp2.replace('{','').replace('}','');
			geta=geta+tmp2;
		}		
		
		
	}
	navStyle =wp_get_navstyle(layer_id,'datastys_');
	var getlia='';
	if(navStyle.length > 0)
	{		 
		var layidlow=('#nav_'+layer_id+' li.wp_subtop>a:hover').toLowerCase();
		if( ('a'+navStyle).toLowerCase().indexOf(layidlow)>0){			
			var parstr="#nav_"+ layer_id +" li.wp_subtop>a:hover";
			getlia = navStyle.split(new RegExp(parstr,"i"));
			var combilestr='';
			for(key in getlia){
				var ervervalue='';				
				if(('a'+getlia[key]).indexOf('{')<3 && ('a'+getlia[key]).indexOf('{')>0 ){
					var parvalue=getlia[key].split('{');
					if(('a'+parvalue[1]).indexOf('}')>0){
						ervervalue=parvalue[1].split('}')[0];
					}
				}
				combilestr=combilestr+ervervalue;
			}
			geta=geta+combilestr;
		}
		
		layidlow=('#nav_'+layer_id+' li.wp_subtop:hover').toLowerCase();
		if( ('a'+navStyle).toLowerCase().indexOf(layidlow)>0){			
			var parstr="#nav_"+ layer_id +" li.wp_subtop:hover";
			getlia = navStyle.split(new RegExp(parstr,"i"));
			var combilestrs='';
			for(key in getlia){
				var ervervalue='';				
				if(('a'+getlia[key]).indexOf('{')<3 && ('a'+getlia[key]).indexOf('{')>0 ){
					var parvalue=getlia[key].split('{');
					if(('a'+parvalue[1]).indexOf('}')>0){
						ervervalue=parvalue[1].split('}')[0];
					}
				}
				combilestrs=combilestrs+ervervalue;
			}
			getli=getli+combilestrs;
		}
	 
		
	}
	
	if(getli.length>0){
		getli="#"+layer_id+" li.lihover{"+getli+"} ";
	}
	if(geta.length>0){
		geta="#"+layer_id+" li>a.ahover{"+geta+"} ";
	}
	cssstyle=getli+geta;	 
	if(cssstyle.length>0){		
		cssstyle=""+cssstyle+"";
		cssstyle=cssstyle.replace(/[\r\n]/g, " ").replace(/\s+/g, " "); 
		var doms=$('#'+layer_id);
		var oldcssstyle=doms.data('get_layer_hover_css');
		if(oldcssstyle != cssstyle){
			$("#hover"+layer_id+"").text(""+cssstyle+"");	
			doms.data('get_layer_hover_css',cssstyle);
			get_plugin_css('H'+layer_id+'H',cssstyle);
		}
	}
}

function wp_showdefaultHoverCss(layer_id){
	var layertype=$('#'+layer_id).attr('type');
	if(layertype && window['wp_showdefaultHoverCss_'+layertype]){
		return window['wp_showdefaultHoverCss_'+layertype](layer_id);
	}
	return false;
}

function wp_showdefaultHoverCss_article_category(layer_id)
{
	var plugin_name=$("#"+layer_id).attr('type');
	var hover=$("#"+layer_id).find('.nav1').attr('hover');
	if(hover!=1){ return;}
	
	wp_getdefaultHoverCss(layer_id);
	var n=0;
 
	if(plugin_name=='new_navigation'){
		var page_id=$("#page_id").val();
	}else{
		var page_id=$('#'+layer_id+'').find(".default_pid").html();
		if(page_id==0 || page_id.length==0){
			page_id=$('#nav_'+layer_id+'').children('li:first').attr('pid');	
		}
	}
	$('#nav_'+layer_id+'').children('li').each(function(){
		var type_pid=$(this).attr('pid');		
		if(type_pid==page_id){
			$(this).addClass("lihover").children('a').addClass("ahover");
		}
		if(window.location.href == $(this).find("a").attr("href") || window.location.href == $(this).find("a").attr("href")+"&brd=1"){ $(this).addClass("lihover").children('a').addClass("ahover"); }
		n++;
	});

	// bug10217
    if(!$('#nav_'+layer_id+'').children('li.lihover').length){
        $('#nav_'+layer_id+' ul').children('li').each(function(){
            var lochref=window.location.href.replace(/^https?:/,'').replace(/&brd=1$/,'');
            var subahref= $(this).find('a').attr("href").replace(/^https?:/,'').replace(/&brd=1$/,'');
            if(lochref == subahref || lochref ==subahref+"&brd=1"){
                $(this).parents(".wp_subtop").addClass("lihover").children('a').addClass("ahover");
                return;
            }
        })
    }
}

function wp_addMoreButton(layer_id){
	var layertype=$('#'+layer_id).attr('type');
	if(layertype && window['wp_addMoreButton_'+layertype]){
		return window['wp_addMoreButton_'+layertype](layer_id);
	}
	return false;
}

function wp_addMoreButton_article_category(layer_id)
{
	var firstLiTop = 0;
	var hasMore = false;
	$('#nav_'+layer_id).children('li.wp_subtop').each(function(i){
		if(i == 0) {firstLiTop = $(this).offset().top;return true;}	
		if($(this).offset().top > firstLiTop)
		{
			$('#'+layer_id).data('hasMore','yes');//配置逻辑获取
			var more = $.trim($('#'+layer_id).children('.wp-article_category_content').children('.nav1').attr('more'));
			var doms = $(this).prev().prev().nextAll().clone();
			var objA = $(this).prev().children('a');
			if(objA.children('span').length > 0) objA.children('span').html(more);
			else objA.html(more);

			if(objA.hasClass('sub'))
			{
				objA.next('ul').empty();
				doms.appendTo(objA.next('ul'));
			}
			else
			{
				objA.after('<ul></ul>');
				doms.appendTo(objA.next('ul'));
				objA.addClass('sub');
			}
				
			$(this).prev().nextAll().remove();
			objA.next('ul').children('li').removeClass('wp_subtop');
			hasMore = true;

			objA.attr('href','javascript:void(0);');
			
			//点击"更多"弹出全站导航
			if($("#"+layer_id).find('.nav1').attr('moreshow') == 1)
			{
				objA.click(function (e){
					$('#'+layer_id).find('#basic-modal-content_'+layer_id).modal({
						containerId:'wp-article_category-simplemodal-container_'+layer_id,
						zIndex:9999,
						close:false,
						onOpen:function(dialog){
							dialog.overlay.fadeIn('slow', function(){
								dialog.container.slideDown('slow',function(){
									dialog.data.fadeIn('slow','swing',function(){
										$('.wp_menus').not('.wp_thirdmenu0').each(function(){
											var left = $(this).parent().parent().children('a').eq(0).outerWidth()+5;
											$(this).css({position:'relative',left:left+'px'});
										});
									});
								});
							});
						},
						onClose:function(dialog){
							dialog.data.fadeOut('slow',function (){
								dialog.container.slideUp('slow', function () {
									dialog.overlay.fadeOut('slow', function () {
										$.modal.close();
									});
								});
							});
						}
					});
					return false;
				});
			}
			return false;
		}
	});
	if(!hasMore) $('#'+layer_id).data('hasMore','no');
	wp_showdefaultHoverCss(layer_id);
}

//编辑模式水平拖动动态刷新修改More按钮
function wp_updateMoreButton(layer_id)
{
	var $layer = $('#'+layer_id);
	var $nav1 = $layer.children('.wp-article_category_content').children('.nav1');
	var tmp_css = $.trim($("#datastys_"+layer_id).text());
	var tmp_cssa = $.trim($("#datasty_"+layer_id).text());
	var param=$layer.get_mod_property();
	$.post(parseToURL("article_category","refreshNavigator",{param:{oldparam:param},menustyle:$.trim($nav1.attr('skin')),saveCss:'yes',page_id:$("#page_id").val(),blockid:layer_id,typeval:$.trim($layer.find(".wp-article_category_content").attr('type')),colorstyle:$.trim($nav1.attr('colorstyle')),direction:$.trim($nav1.attr('direction')),more:$.trim($nav1.attr('more')),hover:$.trim($nav1.attr('hover')),moreshow:$.trim($nav1.attr('moreshow')),morecolor:$.trim($nav1.attr('morecolor'))}),function(data){
		$layer.find('.wp-article_category_content').html(data);
		$("#datastys_"+layer_id).text(tmp_css);
		get_plugin_css(layer_id,tmp_cssa+" "+tmp_css);
	});
	wp_showdefaultHoverCss(layer_id);
}

function wp_removeLoading(layer_id)
{
	
	var $nav1 = $('#'+layer_id).find(".nav1");
	var ishorizon=$nav1.attr("ishorizon");
	if(ishorizon=='1'){
		$("#"+layer_id).find('.wp-new_navigation_content').css({height:'auto',overflow:'hidden'});
	}else{
		$("#"+layer_id).find('.wp-new_navigation_content').css({width:'auto',overflow:'hidden'});
	}
	// 修复IE浏览器部分版本导航无法显示问题 2013/12/26
 
	var temptimer = setTimeout(function(){
		$("#"+layer_id).find('.wp-new_navigation_content').css("overflow", 'visible');
		clearTimeout(temptimer);
	}, 50);
}
 
function wp_get_navstyle(layer_id,key){
    if(jeditMode){
	var navStyle = $.trim($("#"+key+layer_id).text());
    }else{
	var navStyle = $.trim($("#"+layer_id).data(key));
    }
    return navStyle;	
}	;
function layer_article_category_vertical_vs3_func(params){
	var layer_id = params.layer_id;
	var isedit = params.editmode;
	var menustyle = params.menustyle;
	var _getSubMenuHoverCss = function(css_pro,type){
		var typeval=type;
		if(typeval==1){
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}else{
			var regex = "#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{\\s*"+css_pro+"\\s*:[^;]+";
		}
	 
		if(isedit){
		var navStyle = $.trim($("#datastys_"+layer_id).text());
		}else{
		var navStyle = $.trim($("#"+layer_id).data("datastys_"));
		}
		if(navStyle.length > 0)
		{
			var patt1 =new RegExp(regex,'i');
			var tmp = patt1.exec($.trim(navStyle));
			if(tmp)
			{
				return $.trim((tmp[0].match(/{[^:]+:[^;]+/)[0]).match(/:[^;]+/)[0].replace(':',''));
			}
		}
		
		if(isedit){
		navStyle = $.trim($("#datasty_"+layer_id).text());
		}else{
		navStyle = $.trim($("#"+layer_id).data("datasty_"));
		}
	 
		if(navStyle.length > 0)
		{
			if(typeval==1){
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+ul+\\s+li+\\s+a:\\s*hover\\s*{[^}]+}",'i');
			}else{
				var patt1 = new RegExp("#nav_layer[0-9|a-z|A-Z]+\\s+li\.wp_subtop>a:\\s*hover\\s*{[^}]+}",'i');
			}
			var tmp = patt1.exec(navStyle);
			
			if(tmp)
			{
				var tmp1 = tmp[0].match(/{[^}]+}/)[0];
				var patt2 = new RegExp(css_pro+"\\s*:\\s*[^;]+;",'i');
				tmp = patt2.exec(tmp1);
				if(tmp) return $.trim(tmp[0].replace(/[^:]+:/,'').replace(';',''));
			}
		}

		return $.trim($("#nav_"+layer_id+" ul li a").css(css_pro));
	};
	
	$(document).ready(function () {
		$('#nav_'+layer_id).find('li').hover(function(){
			if(isedit){
			var resizehandle = parseInt($('#'+layer_id).children('.ui-resizable-handle').css('z-index'));
			if($(this).hasClass('wp_subtop')) $(this).parent().css('z-index',resizehandle+1);
			}
			$(this).children('ul').show();
		},function(){
			$(this).children('ul').hide();
			if(!($.browser.msie && $.browser.version < 9)){
				if(isedit){
				var resizehandle = parseInt($('#'+layer_id).children('.ui-resizable-handle').css('z-index'));
				var isHover = true;
				$('#nav_'+layer_id).find('ul').each(function(){
					if($(this).css('display') != 'none') {isHover = false;return false;}
				});
				if(isHover) $(this).parent().css('z-index',resizehandle-1);
				}
			}
		});

		var ulheight = 0;
		$("#nav_"+layer_id).find('li.wp_subtop').each(function(){
			ulheight += $(this).outerHeight() + parseInt($(this).css('margin-bottom'));
		});
		$("#nav_"+layer_id).height(ulheight);
		
		$("#nav_"+layer_id).find('li').hover(function(){
			$(this).children('ul').css('margin-left',$(this).outerWidth()+'px');
			$(this).children('ul').css('margin-top',-1*$(this).outerHeight()+'px');
		});
		
		$('.menu_'+menustyle+' #nav_'+layer_id).find('li').hover(function(){
			var direction=$("#"+layer_id).find('.nav1').attr('direction');
			var width = parseInt($(this).outerWidth());
			if(isedit){	
				$('.posblk[super="'+layer_id+'"]').hide();
			}
			if(direction==1){				
				$(this).children('ul').css('left','auto').css('right',(width)+'px').css("padding-right","3px");
			}else{
				$(this).children('ul').css('left','0px').css('right','auto');	
			}	
			if($(this).parent().hasClass('navigation'))
			{
				$('#nav_'+layer_id+' .wp_subtop').removeClass("lihover").children('a').removeClass("ahover");
				$(this).children('a').css({'font-family':_getSubMenuHoverCss("font-family",0),'font-size':_getSubMenuHoverCss("font-size",0),'color':_getSubMenuHoverCss("color",0),'font-weight':_getSubMenuHoverCss("font-weight",0),'font-style':_getSubMenuHoverCss("font-style",0)});
			}else{
				$(this).children('a').css({'font-family':_getSubMenuHoverCss("font-family",1),'font-size':_getSubMenuHoverCss("font-size",1),'color':_getSubMenuHoverCss("color",1),'font-weight':_getSubMenuHoverCss("font-weight",1),'font-style':_getSubMenuHoverCss("font-style",1)});
			}
		},function(){
			if($(this).parent().hasClass('navigation'))
			{
				wp_showdefaultHoverCss(layer_id);
			}
			 $(this).children('a').attr("style",'');
				
		});
		wp_showdefaultHoverCss(layer_id);
	});
}