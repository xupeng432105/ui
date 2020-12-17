declare var ESCMS;
declare var Prism;
var css_playground = require("./playground.css");
var css_iconfont = require('../src/css/iconfont/iconfont.css');
var css_font_acumin = require('../src/css/acumin/font-acumin.css');
var css_prism = require("../node_modules/prismjs/themes/prism-tomorrow.css");
$(function () {
	var script_test_checkBox = `
	$("#testCheckboxButton1").click(function () {
		ESCMS.checkbox.check($("#testCheckbox5"));
	});
	$("#testCheckboxButton2").click(function () {
		ESCMS.checkbox.uncheck($("#testCheckbox5"));
	});
	$("#testCheckboxButton3").click(function () {
		ESCMS.checkbox.enable($("#testCheckbox5"));
	});
	$("#testCheckboxButton4").click(function () {
		ESCMS.checkbox.disable($("#testCheckbox5"));
	});
	`
	$("#testCheckboxCode").html(script_test_checkBox);
	eval(script_test_checkBox);


	var select1 = new ESCMS.dropdownSelect({
		selectId: "orgSelector",
		onselect: function () {
			$("#orgSelector").change();
		}
	});

	var script_test_alert = `
	$("#alert").click(function () {
		alert("Some message", function(){
			alert("Callback")
		});
	});
	`;
	$("#testAlertCode").html(script_test_alert);
	eval(script_test_alert);


	var script_test_confirm = `
	$("#confirm").click(function () {
		ESCMS.confirm("Some message", function(){
			alert("Confirmed")
		}, function(){
			alert("canceled")
		});
	});
	$("#confirmGroup").click(function () {
		ESCMS.confirm("This is a group message1", null, null , "g1");
		ESCMS.confirm("This is a group message2", null, null , "g1");
		ESCMS.onConfirmGroupComplete("g1", function(){
			alert("Group 'g1' is completed")
		})
	})
	`;
	$("#testConfirmCode").html(script_test_confirm);
	eval(script_test_confirm);




	ESCMS.btnsGroup.init($("#testBtnGroup")[0]);
	$("#showModal").on("click", function () {
		new ESCMS.modal({
			content: '<audio id="audioPlayer" src="" controls="controls">Your browser does not support the audio element.</audio>',
			title: false,
			width: 400,
			height: 100,
			canMove: true,
			canResize: true,
			showBackDrop: true,
			backDropClose: false,
			onshow: function () {
				(document.getElementById("audioPlayer") as any).play();
			}
		})
	});

	new ESCMS.column({
		cookieName: "PROGRAM_COLUMNS",
		cookiePath: "/content/program",
		container: $("#columnContainer")[0],
		options: [{
			name: 'image',
			text: 'Image',
			checked: 'true',
			required: 'false'
		}, {
			name: 'program',
			text: 'Program',
			checked: 'true',
			required: 'true'
		}]
	});
	//Limited viewer
	ESCMS.limitedViewer.init($('#testLiminitedViewer1'));

	ESCMS.limitedViewer.init($('#testLiminitedViewer2'));
	$('#Button_testLiminitedViewer2').click(function () {
		ESCMS.limitedViewer.unfold($('#testLiminitedViewer2'));
	});

	ESCMS.limitedViewer.init($('#testLiminitedViewer3'));
	ESCMS.limitedViewer.unfold($('#testLiminitedViewer3'));
	$('#Button_testLiminitedViewer3').click(function () {
		ESCMS.limitedViewer.fold($('#testLiminitedViewer3'));
	});

	var gss = new ESCMS.globalSearch({
		targetElement: $("#gs")[0],
		context: "${pageContext.request.contextPath}",
		contentTypes: [
			{ name: "Configuration", path: "/manage/other/config/list.do", param: "criteria" },
			{ name: "Program", path: "/content/program/list.do", param: "criteria" },
			{ name: "Game", path: "/content/gameschedule/list.do", param: "criteria" },
			{ name: "Category", path: "/content/category/list.do", param: "criteria" },
			{ name: "Customer", path: "/party/list.do", param: "criteria" }
		]
	});
	$("#testSearchLoading").html(new ESCMS.searchLoading().html());
	new ESCMS.percentageBar({
		$targetElement: $("#processCpuUsage"),
		items: [{
			value: "10%",
			colorChange: true,
			title: "10%"
		}, {
			value: "20%",
			color: "red",
			colorChange: true,
			title: "20%"
		}]
	});
	ESCMS.contentSelectorInput.init({
		$targetElement: $("#testContentSelectorInput")
	});

	var contentEditor = new ESCMS.contentEditor({
		targetElement: $("#testContentEditor")[0],
		val: "F745D9F0-D7BA-3DE5-A18C-D7DAAC10002C",
		rules: [{
			name: "required"
		}, {
			name: "uuid"
		}],
		beforeSave: function(val) {
			ESCMS.confirm("Are you sure to save this value?", function(){
				contentEditor.save(val);
			});
			return false;
		}
	});
	// setTimeout(function(){
	// 	contentEditor.edit();
	// 	contentEditor.setError("Are you sure to save this valueAre you sure to save this valueAre you sure to save this valueAre you sure to save this valueAre you sure to save this valueAre you sure to save this value", {
	// 		maxWidth: 500
	// 	})
	// },100)
	
	setTimeout(function () { Prism.highlightAll() }, 0);

})
