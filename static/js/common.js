var langType = 'zh'
var showFakeHeader = false
var showHeaderNavChildlist = false
var admission = true
var isLogined = false
var teamType = ''
var aUrl = location.host.match(/local|test/)
  ? 'http://worktest.labelant.cn'
  : 'https://work.labelant.cn'
var bUrl = location.host.match(/local/)
  ? 'http://blocal.weelabel.com'
  : 'http://anno.weelabel.com'
var uUrl = location.host.match(/local|test/)
  ? 'http://worktest.labelant.cn/api/v1.0.0'
  : 'https://work.labelant.cn/api/v1.0.0' // 目前正式和测试的接口域名一致
var loginCheckUrl = uUrl + '/login/check'
var demandModal = `<div class="demand-box">
  <div class="demand-row">
    <input id="demandName"
      required="required"
      type="text"
      placeholder="{{ language.get('aboutus-demand-name').get(la) }}">
  </div>
  <div class="demand-row">
    <input id="demandEmail"
      required="required"
      type="text"
      placeholder="{{ language.get('aboutus-demand-email').get(la) }}">
  </div>
  <div class="demand-row">
    <input id="demandCompany"
      required="required"
      type="text"
      placeholder="{{ language.get('aboutus-demand-company').get(la) }}">
  </div>
  <div class="demand-row">
    <select id="demandType"
      required="required">
      {{ language.get('aboutus-demand-type').get(la) | safe }}
    </select>
  </div>
  <div class="demand-row">
    <input id="demandNumber"
      required="required"
      type="text"
      placeholder="{{ language.get('aboutus-demand-number').get(la) }}">
  </div>
  <div class="demand-row high-row">
    <textarea id="demandDesc"
      required="required"
      placeholder="{{ language.get('aboutus-demand-desc').get(la) }}"></textarea>
  </div>
  <button id="btnClose">&times;</button>
  <button id="btnSubmit">{{ language.get("submit").get(la) }}</button>
</div>`

if (admission) {
  $('#headerSignin').show()
  $('#fHeaderSignin').show()
} else {
  $('#headerSignin').hide()
  $('#fHeaderSignin').hide()
}

// 20200403 涉及到跨站，并且后端相应接口已经去除，所以检测是否登录而显示登录按钮的功能去除
// 得到雨宁和志男的确认
/* $.get(loginCheckUrl, function (data, status) {
  if (data && status) {
    if (data.code && data.code === 200) {
      isLogined = true
      if (data.data && data.data.type) {
        teamType = data.data.type
      }
      $('#headerSignin').hide()
      $('#fHeaderSignin').hide()
    } else {
      isLogined = false
      $('#headerSignin').show()
      $('#fHeaderSignin').show()
    }
  }
}) */

// 手机版本监听切换菜单按钮
$('#header').on('click', function (e) {
  if (e.target.className === 'btn-menu') {
    $('#header')[0].className = 'hide-header'
    $('.fake-header').toggleClass('full-header')
    $('.btn-menu').each(function (_, item) {
      item.className = 'btn-menu btn-shut'
    })
  } else if (e.target.className === 'btn-menu btn-shut') {
    $('#header')[0].className = ''
    $('.fake-header').toggleClass('full-header')
    $('.btn-menu').each(function (_, item) {
      item.className = 'btn-menu'
    })
  }
})

// 监听语言切换按钮
$('#btnSwitchLang').on('click', function (e) {
  var _reqLang = 'weelabel-languageTp=en'
  if (document.cookie.indexOf('weelabel-languageTp=zh') !== -1) {
    _reqLang = 'weelabel-languageTp=en'
  } else if (document.cookie.indexOf('weelabel-languageTp=en') !== -1) {
    _reqLang = 'weelabel-languageTp=zh'
  } else {
    _reqLang = 'weelabel-languageTp=zh'
  }
  document.cookie = _reqLang + ';path=/'
    location.reload()
})

// 监听屏幕滚动，以适时放下/收起 header
$(window).on('scroll', function (e) {
  var $fakeHeader = $('.fake-header')
  var $btnUpToTop = $('#btnUpToTop')
  if ($fakeHeader.hasClass('full-header')) {
    e.preventDefault()
  }
  if (!showFakeHeader
  && $(window).scrollTop() > 80
  && !$fakeHeader.hasClass('show-header')) {
    showFakeHeader = true
    $fakeHeader.addClass('show-header')
  } else if (showFakeHeader
  && $(window).scrollTop() <= 79
  && !$fakeHeader.hasClass('full-header')) {
    showFakeHeader = false
    $fakeHeader.removeClass('show-header')
  }
  $fakeHeader = null
  if (showHeaderNavChildlist || $('.show-childlist').length > 0) {
    $('.nav-list-childlist')[0].className = 'nav-list-childlist'
    showHeaderNavChildlist = false
  }
})

// 监听 btnUpToTop，可以跳到最上
$('#btnUpToTop').on('click', function () {
  scrollTo(0, 0)
})

// 跳转到关于页
function jumpToAboutus () {
  location.assign('/aboutus')
}
// 跳转到申请试用页
function jumpToTrial () {
  location.assign('/trial')
}

// 需求弹窗
var validDemandPass = true
function showDemandModal () {
  if ($('.demand-stage').length
  && $('.demand-stage').css('display') === 'none') {
    $('.demand-stage').css('display', 'block')
  } else if (!$('.demand-stage').length) {
    var dom = document.createElement('div')
    dom.className = 'demand-stage'
    $(dom).html(demandModal)
    $('body').append($(dom))
    var demandList = [
      $('#demandName'),
      $('#demandEmail'),
      $('#demandCompany'),
      $('#demandType'),
      $('#demandNumber'),
      $('#demandDesc')
    ]

    // 输入框失去焦点后执行校验
    $(demandList).each(function () {
      $(this).on('blur', function () {
        if (!$(this).val()) {
          validDemandPass = false
          $(this).hasClass('warn-input')
           ? void (0)
           : $(this).addClass('warn-input')
        } else {
          $(this).hasClass('warn-input')
           ? $(this).removeClass('warn-input')
           : void (0)
        }
      })
    })

    // 关闭需求弹窗
    $('#btnClose').on('click', function () {
      $('.demand-stage').css('display', 'none')
    })
  }
}

// 监听需求弹窗提交
$('#btnSubmit').on('click', function () {
  var demandList = [
    $('#demandName'),
    $('#demandEmail'),
    $('#demandCompany'),
    $('#demandType'),
    $('#demandNumber'),
    $('#demandDesc')
  ]
  $(demandList).each(function () {
    if (!$(this).val()) {
      validDemandPass = false
      $(this).hasClass('warn-input')
       ? void (0)
       : $(this).addClass('warn-input')
    } else {
      $(this).hasClass('warn-input')
       ? $(this).removeClass('warn-input')
       : void (0)
    }
  })
  if (!validDemandPass) {
    return
  } else {
    var url = '/user/demand'
    var data = {
      name: $('#demandName').val(),
      email: $('#demandEmail').val(),
      company: $('#demandCompany').val(),
      demand_type: $('#demandType').val(),
      forecast_number: $('#demandNumber').val(),
      demand: $('#demandDesc').val()
    }
    function callback (res, _) {
      if (res.data.code !== 200) {
        console.warn(res.data.msg)
      } else {
        console.log('')
      }
    }
    $.post(url, data, callback)
  }
})

// 监听登录按钮，跳转登录页面
$('#headerSignin').on('click', function () {
  if (!admission) {
    jumpToAboutus()
    return
  }
  location.assign('/signin')
})

// 监听 fake-header 登录按钮，跳转登录页面
$('#fHeaderSignin').on('click', function () {
  if (!admission) {
    jumpToAboutus()
    return
  }
  location.assign('/signin')
})

// 监听 navlist 中的工具 tag，悬停则显示子 list
var showHeaderNavChildlist = false
$('.nav-list-parentitem').each(function (_, item) {
  $(item).on('mouseover', function (e) {
    if ($('.full-header').length > 0 ||
        $('.show-childlist').length > 0 ||
        showHeaderNavChildlist) {
      return
    }
    $('.nav-list-childlist')[0].className = 'nav-list-childlist show-childlist'
    $('.nav-list-childlist').css({
      left: e.target.getBoundingClientRect().x +
            e.target.getBoundingClientRect().width / 2 - 212 + 'px'
    })
    showHeaderNavChildlist = true
  })
})

// 隐藏子 list 的通用函数
function fadeoutChildlist () {
  if ($('.full-header').length > 0 ||
    $('.show-childlist').length === 0 ||
    !showHeaderNavChildlist) {
    return
  }
  $('.nav-list-childlist')[0].className = 'nav-list-childlist fade-childlist'
  setTimeout(() => {
  $('.nav-list-childlist')[0].className = 'nav-list-childlist'
  showHeaderNavChildlist = false
  }, 700)
}

// 监听 header 上鼠标指针的行为，滑向其它导航标签则关闭子 list
$('.header-nav-list a').on('mouseenter', function (e) {
  e.stopPropagation()
  if (e.target.tagName !== 'A') {
    return
  }
  if ($(e.target).hasClass('normal-a')) {
    fadeoutChildlist()
  }
})

// 监听工具的子 list，鼠标离开则隐藏子 list
$('.nav-list-childlist').on('mouseleave', function () {
  fadeoutChildlist()
})

// 监听工具的子 list 中的关闭按钮，平板模式下适用
$('.td-shut>span').on('click', function () {
  fadeoutChildlist()
})

// 监听屏幕改变，当宽度大于 480px 时，自动关闭全屏 header
$(window).on('resize', function () {
  if (document.body.offsetWidth > 480) {
    var $fakeHeader = $('.fake-header')
    if (!$fakeHeader.hasClass('full-header')) {
      return $fakeHeader = null
    }
    $('#header')[0].className = ''
    $fakeHeader.removeClass('full-header')
    $('.btn-menu').each(function (_, item) {
      item.className = 'btn-menu'
    })
    $fakeHeader = null
  }
})

// 监听所有的 btn-demand 按钮，跳转到填写需求页
$('.btn-demand').each(function (_, item) {
  $(item).on('click', function () {
    jumpToAboutus()
    return
    // 20200407 是否登录接口目前已被废弃，所以下半部分代码无效
    /* if (!admission) {
      jumpToAboutus()
      return
    }
    // teamType=1 需求方， teamType=2 标注团队
    if (isLogined && teamType === 1) {
      location.assign(bUrl)
    } else if (isLogined && teamType === 2) {
      location.assign(aUrl)
    } else if (!isLogined) {
      location.assign('/signup')
    } */
  })
})

// 监听所有的 btn-trial 按钮，跳转到申请试用页
$('.btn-trial').each(function (_, item) {
  $(item).on('click', function () {
    jumpToTrial()
    return
    // 20200407 是否登录接口目前已被废弃，所以下半部分代码无效
    /* if (!admission) {
      jumpToAboutus()
      return
    }
    // teamType=1 需求方， teamType=2 标注团队
    if (isLogined && teamType === 1) {
      location.assign(bUrl)
    } else if (isLogined && teamType === 2) {
      location.assign(aUrl)
    } else if (!isLogined) {
      location.assign('/signup')
    } */
  })
})

// 监听标注团队入驻入口，判断跳转 20200331 暂缓开放
/* $('#teamJoin').on('click', function () {
  if (!isLogined) {
    location.assign('http://' + location.host + '/signup')
  } else if (isLogined && teamType === 2) {
    location.assign(bUrl + '/#/team/agreement')
  }
}) */

// 监听标注人员注册入口，进行跳转 20200331 暂缓开放
/* $('#staffJoin').on('click', function () {
  location.assign('http://' + location.host + '/signup?tagging=true')
}) */
