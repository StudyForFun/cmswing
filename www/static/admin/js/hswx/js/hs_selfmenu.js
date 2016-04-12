/**
 * 添加一级菜单
 */
function hsAddFirstMenu(){
	var abtn = $('.hs-menu-li.hs-menu-item-add');
	var mli = $(".hs-menu-item");//当前菜单个数
	var n = mli.length;
	var sizeof = n==0?'sizeof2':n==1?'sizeof3':n==2?'sizeof3':'';
	if(n == 1){
		mli.removeClass('sizeof2').addClass('sizeof3');
	}
	$(".hs-menu-a").removeClass("hs-current").removeClass('hs-current-edit');//移除所有的选择状态
	var fdom = ['<li class="hs-menu-li hs-menu-item '+ sizeof +'">',
		'	<a class="hs-menu-a hs-current hs-current-edit" href="javascript:void(0)">',
		'		<i></i>',
		'		<span>菜单名称</span>',
		'	</a>',
		'	<div class="hs-menu-sub">',
		'		<ul class="hs-menu-sub-ul">',
		'			<li class="hs-menu-sub-li hs-subitem-add">',
		'				<a class="hs-menu-a" href="javascript:void(0)">',
		'					<em class="hs-sub-inner">',
		'						<span class="hs-madd"></span>',
		'					</em>',
		'				</a>',
		'			</li>',
		'		</ul>',
		'	</div>',
		'</li>'].join("");
	abtn.before(fdom);
}

/**
 * 添加二级菜单
 * @param {Object} abtn //添加按钮
 */
function hsAddSecoundMenu(abtn){
	//var sli = abtn.siblings('li');
	$(".hs-menu-a").removeClass("hs-current");//移除所有的选择状态
	var sdom = ['<li class="hs-menu-sub-li">',
		'	<a class="hs-menu-a hs-current" href="javascript:void(0)">',
		'		<em class="hs-sub-inner">',
		'			<i></i>',
		'			<span>子菜单名称</span>',
		'		</em>',
		'	</a>',
		'</li>'].join("");
	abtn.before(sdom);
}

/**
 * 2块儿编辑的显示问题
 */
function hsMRPShowOrHide(){
	var eVal = arguments[0] ? arguments[0] : $('[name=nnn]:checked').val();
	$('.hs-menuright-panel').hide();
	$('.hs-mrp' + eVal).show();
    $('[name=nnn]').removeAttr('checked').filter('[value='+eVal+']').attr('checked', 'checked');
    $('.hs-ico-radio').removeClass('hs-selected');
    $('[name=nnn]').filter('[value='+eVal+']').siblings('.hs-ico-radio').addClass('hs-selected');
}

/**
 * 事件
 */
$(function(){
	/**
	 * 添加一级菜单
	 */
	$(document).on('click', '.hs-menu-li.hs-menu-item-add',function(){
		hsAddFirstMenu();
        $('.hs-current').trigger('click')
	});
	
	/**
	 * 单击一级菜单
	 */
	$(document).on('click', '.hs-menu-item:not(.hs-menu-item-add) > .hs-menu-a', function(){
		$('.hs-menu-a').removeClass('hs-current').removeClass('hs-current-edit');
		$(this).addClass('hs-current').addClass('hs-current-edit')
        /* 数据操作 start */
        var currData = $(this).data('currData');
        if(!currData){
            currData = { name:'菜单名称', type:1, act_list:[], sub_button:[] };
            $(this).data('currData', currData);
        }
        hsInitMenuRight(currData);
        /* 数据操作 end */        
	});
	
	/**
	 * 添加二级菜单
	 */
	$(document).on('click', '.hs-subitem-add', function(e){
		hsAddSecoundMenu($(this));
		e.stopPropagation();
        $('.hs-current').trigger('click')
	});
	
	/**
	 * 单击二级菜单
	 */
	$(document).on('click', '.hs-menu-sub-li:not(.hs-subitem-add) > .hs-menu-a', function(){
		$('.hs-menu-a').removeClass('hs-current');
		$(this).addClass('hs-current');
        /* 数据操作 start */
        var pFirstEl = $(this).closest('.hs-menu-sub').siblings('.hs-menu-a');
        var thisIndex = $(this).parent('li').index();
        var parentData = pFirstEl.data('currData');
        var currData = parentData.sub_button[thisIndex];
        if(!currData){
            currData = { name:'子菜单名称', type:1, act_list:[], sub_button:[] };
            //更新当前菜单数据
            parentData.sub_button[thisIndex] = currData;
            pFirstEl.data('currData', parentData);
        }
        hsInitMenuRight(currData);
        /* 数据操作 end */  
	})
	
	/**
	 * 初始化编辑块儿
	 */
	//hsMRPShowOrHide(1);
	$(document).on('click', '[name=nnn]', function(){
		hsMRPShowOrHide();
	})
    
    
    //- 丰富效果 start ------------------------------- 
    //菜单名称 blur
    $(document).on('blur', '#hsCurrentMenuName', function(){
        hsUpdateCurrentData();
       
    })
    //- 丰富效果 end   ------------------------------- 
});



/***************************/
/**
 * 初始化菜单布局
 * @param {Object}
 */  
function hsInitMenu(menuData){
    try{
        var btnlist = menuData.button
        var nlist = btnlist.length;//一级菜单个数
        for(var i in btnlist){
            var currbtn = btnlist[i];
            var sublist = currbtn.sub_button;
            
            //初始化右侧数据
            if(i==0){
                hsInitMenuRight( ( sublist.length == 0 ? currbtn : sublist[0] ) );
            }
            //构建左侧dom
            var fli = document.createElement('li');
            fli.className = 'hs-menu-li hs-menu-item ' + (nlist==1?'sizeof2':nlist>1?'sizeof3':'');
            
            var fa = document.createElement('a');
            fa.className = 'hs-menu-a ' + (i==0?'hs-current-edit':'') + ' ' + (sublist.length==0&&i==0?'hs-current':'');
            fa.href = 'javascript:void(0)';
            fa.innerHTML = '<i></i><span>'+ (currbtn.name || '菜单名称') +'</span>';
            
            //绑定数据
            $(fa).data('currData', currbtn);
            
            var menuul = document.createElement('ul');
            menuul.className = 'hs-menu-sub-ul';
            //子菜单
            for(var j in sublist){
                var subbtn = sublist[j];
                var sli = document.createElement('li');
                sli.className = 'hs-menu-sub-li';
                sli.innerHTML = '<a class="hs-menu-a '+ (i==0&&j==0?'hs-current':'') +'" href="javascript:void(0)"><em class="hs-sub-inner"><i></i><span>'+ (subbtn.name||'子菜单名称') +'</span></em></a>';
                menuul.appendChild(sli);
            }
            
            var subaddli = document.createElement('li'); // 子菜单 + 号
            subaddli.className = 'hs-menu-sub-li hs-subitem-add';
            subaddli.innerHTML = '<a class="hs-nocan" href="javascript:void(0)"><em class="hs-sub-inner"><span class="hs-madd"></span></em></a>';
            menuul.appendChild(subaddli);
            
            //子菜单域
            var menusubdiv = document.createElement('div');
            menusubdiv.className = 'hs-menu-sub';
            menusubdiv.appendChild(menuul);
            
            fli.appendChild(fa);
            fli.appendChild(menusubdiv);
            
            $('.hs-menu-item-add').before(fli);
        }
    }catch(e){
        console.log('function hsInitMenu has error');
    }
}




// +++
// var menusub = document.createElement('div');
//         var menuul = document.createElement('ul');
//         menusub.appendChild(menuul);
//         document.body.innerHTML = '';
//         document.body.appendChild(menusub);

/**
 * 初始化右侧按钮数据
 * @param {Object} 
 */  
function hsInitMenuRight(onebtn){
    try{
        if(!onebtn){ 
            console.error('param onebtn can not null'); 
            return false;
        }
        // var options = {
        //     name: '菜单名称',
        //     type: 1,
        //     act_list:[],
        //     sub_button:[]
        // };
        
        var currentMenuNameEle = $ID('hsCurrentMenuName');
        currentMenuNameEle.value = onebtn.name; //菜单名称赋值
        
        //如果有值
        if(onebtn.act_list.length > 0){
            var tmp = onebtn.act_list[0];
            switch(onebtn.type){
                case 1:
                break;
                case 2:
                    $ID('hsUrlValue').value = tmp.value;
                break;
            }
        }
        
        hsMRPShowOrHide(onebtn.type); //显示编辑块儿
    }catch(e){
        console.error('function hsInitMenuRight has error');
    }
}
// var options = {
//     name: '菜单名称',
//     type: 2,
//     act_list:[
//         { type: 2, value:'http://www.baidu.com' }
//     ],
//     sub_button:[]
// };
//hsInitMenuRight(options);

//取个id玩儿玩儿
function $ID(str){ return document.getElementById(str); }
/**----- 取值 ----*/
/**
 * 取右侧的数据
 * @return { name:'', type: 1/2.., act_list:[] } 
 */  
function hsGetRightValue(){
    //判断当前是2级菜单还是 1级菜单
    var currEl = $('.hs-current');
    var level  = currEl.hasClass('hs-current-edit') ? 1 : 2;
    //取name值
    var name = $ID('hsCurrentMenuName').value || (level==1?'菜单名称':'子菜单名称');
    //设定key值
    var key = (new Date().getTime())+"KEY";
    //取type值
    var type = $('[name=nnn]').filter('[checked]').val();
    //取act_list
    var actList = [];
    // var navPanel = $('.hs-etap-nav');
    // var navActive = navPanel.find('li.active');
    // var navActiveValue = navActive.attr('jstab-target');
    // switch (navActiveValue){
    //     case 'newsArea':
    //     break;
    // }
    
    return { name: name, key:key, type:type, act_list:actList };
}

/**
 * 将数据更新到当前位置 并且更新 显示
 * @argument
 */  
function hsUpdateCurrentData(){
    var targetData = arguments[0] || hsGetRightValue();
    //判断当前是2级菜单还是 1级菜单
    var currEl = $('.hs-current');
    var level  = currEl.hasClass('hs-current-edit') ? 1 : 2;
    var FEL = $('.hs-current-edit');
    if(level == 1){
        FEL.data('currData', $.extend(FEL.data('currData'), targetData) );
    }else if(level == 2){
        var currIndex = currEl.parent('li').index();
        var tmp = FEL.data('currData');
        tmp.sub_button[currIndex] = $.extend( tmp.sub_button[currIndex], targetData);
        FEL.data('currData', tmp );
    }else{
        console.error('function hsUpdateCurrentData has error');
    }
    
    //更新显示
    currEl.find('span').html(targetData.name);
}

/**
 * 返回当前整个菜单数据
 */  
function hsGetCurrentAllData(){
    var currAllData = { version: new Date().getTime(), button:[] };
    $('.hs-menu-item > .hs-menu-a').each(function(i, o){
        var tmp = $(o).data('currData');
        currAllData.button.push(tmp);
    });
    console.log(currAllData);
    return currAllData;
}