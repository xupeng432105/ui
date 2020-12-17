import { JQ_EVENT, JQ_KEY } from "../cons";
import { isDom, mergeCfg, mergeCustomCssClasses } from "../utils";
import { logger } from "./logger";

/**
 * To create a resizable and dragable modal
 * ```
 * new ESCMS.modal({
 *       content:'<audio id="audioPlayer" src="" controls="controls">Your browser does not support the audio element.</audio>',
 *       title:false,
 *       width:400,
 *       height:100,
 *       canMove:true,
 *       canResize:false,
 *       showBackDrop:false,
 *       onshow:function(){
 *       	document.getElementById("audioPlayer").play();
 *       }
 *     })
 * ```
 */
export class EsModal {
  static modalIndex = 0;
  index;
  cfg: EsModalCfg;
  $rootElement: JQuery;
  timeflag_closeBtn;
  /**
   * 
   * @param cfg 
   */
  constructor(cfg: EsModalCfg) {
    EsModal.modalIndex++;
    this.index = EsModal.modalIndex;
    this.init(cfg);
  }
  init(cfg: EsModalCfg) {
    this.mergeConfig(cfg);
    if (this.cfg.showBackDrop)
      this.createBackDrop();
    this.createModal();
  }
  mergeConfig(cfg: EsModalCfg) {
    let defaultCfg = {
      content: "",
      container: document.body,
      title: false,
      closeBtn: true,
      closeBtnType: 0,
      showCloseBtnOnHover: false,
      width: "",
      height: "",
      offset: ["auto", "auto"],
      canMove: false,
      canResize: false,
      resizeMinWidth: 200,
      resizeMinHeight: 100,
      showBackDrop: true,
      backDropClickClose: true,
      customCssClasses: [],
      onshow: function () { },
      onDestroy: function () { }
    };
    this.cfg = mergeCfg(defaultCfg, cfg);
  }
  createBackDrop() {
    let self = this;
    $("body").append('<div class="es-modal-backdrop" modal-index="' + this.index + '"></div>');
    if (this.cfg.backDropClickClose) {
      $(".es-modal-backdrop[modal-index=" + this.index + "]").click(function () {
        self.destroy();
      });
    }
  }
  createModal() {
    let self = this;
    let rootCssClasses = ["es-modal"];
    rootCssClasses = mergeCustomCssClasses(this.cfg.customCssClasses, rootCssClasses, ["canmove", "canresize", "onmove"]);
    let str = '\
        <div class="' + rootCssClasses.join(" ") + '" style="visibility:hidden;width:' + this.cfg.width + 'px;height:' + this.cfg.height + 'px;" modal-index="' + EsModal.modalIndex + '">';
    str += '</div>';
    $(this.cfg.container).append(str);
    this.$rootElement = $(this.cfg.container).find(".es-modal[modal-index=" + this.index + "]");
    if (this.cfg.title)
      this.createTitle();
    if (this.cfg.closeBtn)
      this.createCloseBtn();
    this.$rootElement.append('<div class="es-modal-ovf"></div>');
    this.createContent();
    this.calculateOffset();
    if (this.cfg.canMove)
      this.createDragger();
    if (this.cfg.canResize)
      this.createResizer();
    $(window).on(JQ_EVENT.resize, function () {
      self.calculateOffset();
    });
    this.$rootElement.css({
      visibility: "visible"
    });
    this.cfg.onshow();
    $("body").on("keyup", function (e) {
      if (e.key == JQ_KEY.esc)
        self.destroy();
    })
  }
  createTitle() {
    this.$rootElement.append(
      '<div class="es-modal-title">\
                    <span class="es-modal-title-name">'+ this.cfg.title + '</span>\
                    \
                 </div>'
    )
  }
  createCloseBtn() {
    let self = this;
    this.$rootElement.append('<span class="es-modal-closebtn iconfont icon-false"></span>');
    if (this.cfg.closeBtnType)
      this.$rootElement.find(".es-modal-closebtn").addClass("sty" + this.cfg.closeBtnType);
    if (this.cfg.showCloseBtnOnHover) {
      $(this).find(".es-modal-closebtn").hide();
      this.$rootElement.on(JQ_EVENT.mouseleave, function () {
        let self0 = this;
        self.timeflag_closeBtn = setTimeout(function () {
          $(self0).find(".es-modal-closebtn").hide();
        }, 1500);
      }).on(JQ_EVENT.mouseenter, function () {
        clearTimeout(self.timeflag_closeBtn);
        $(this).find(".es-modal-closebtn").show();
      })
    }
    this.$rootElement.find(".es-modal-closebtn").on(JQ_EVENT.click, function () {
      self.destroy();
    });
  }
  createContent() {
    this.$rootElement.find(".es-modal-ovf").append('<div class="es-modal-content"></div>')
    //get content
    let content: any = "";
    if (typeof this.cfg.content == "string") {
      content = this.cfg.content;
      this.$rootElement.find(".es-modal-content").html(content);
    }
    else if (isDom(this.cfg.content)) {
      content = $(this.cfg.content).clone(true);
      console.log(content);
      content.appendTo(this.$rootElement.find(".es-modal-content"));
      this.$rootElement.find(content).show();
    }
  }
  calculateOffset() {
    //calculate offset
    let offsetX, offsetY;
    if (this.cfg.offset[0] !== "" && this.cfg.offset[0] !== 'auto' && this.cfg.offset[0] !== undefined) {
      offsetX = this.cfg.offset[0];
    }
    else {
      let modalWidth = this.$rootElement.outerWidth();
      let windowWidth = $(window).width();
      offsetX = (windowWidth - modalWidth) / 2;
      offsetX = offsetX >= 0 ? offsetX : 0;
    }

    if (this.cfg.offset[1] !== "" && this.cfg.offset[1] !== 'auto' && this.cfg.offset[1] !== undefined) {
      offsetY = this.cfg.offset[1];
    }
    else {
      let modalHeight = this.$rootElement.outerHeight();
      let windowHeight = $(window).height();
      offsetY = (windowHeight - modalHeight) / 2;
      offsetY = offsetY >= 0 ? offsetY : 0;
    }

    this.$rootElement.css({
      left: offsetX + 'px',
      top: offsetY + 'px'
    });
  }
  createDragger() {
    let self = this;
    if (this.cfg.canMove) {
      let onMove = false;
      let mouseX0;
      let mouseY0;
      let offsetX0;
      let offsetY0;
      this.$rootElement.append('<div class="es-modal-move-dragger"></div>');
      this.$rootElement.find(".es-modal-move-dragger").mousedown(function (e0) {
        onMove = true;
        mouseX0 = e0.pageX;
        mouseY0 = e0.pageY;
        offsetX0 = self.$rootElement[0].getBoundingClientRect().left;
        offsetY0 = self.$rootElement[0].getBoundingClientRect().top;
        self.$rootElement.addClass("canmove");
        $("body")
          .on("mousemove", (this as any).mousemoveHandler1 = function (e) {
            if (onMove) {
              let mouseX1 = e.pageX;
              let mouseY1 = e.pageY;
              let offsetX1 = offsetX0 + (mouseX1 - mouseX0);
              let offsetY1 = offsetY0 + (mouseY1 - mouseY0);
              offsetX1 = offsetX1 >= 0 ? offsetX1 : 0;
              offsetY1 = offsetY1 >= 0 ? offsetY1 : 0;
              logger.dev(offsetX1);
              self.$rootElement.css({
                left: offsetX1 + "px",
                top: offsetY1 + "px"
              })
            }
          })
          .on("mouseup", (this as any).mouseupHandler1 = function (e) {
            if (onMove) {
              onMove = false;
              mouseX0 = null;
              mouseY0 = null;
              offsetX0 = null;
              offsetY0 = null;
              self.$rootElement.removeClass("canmove");
              $("body").off("mousemove", this.mousemoveHandler1);
              $("body").off("mouseup", this.mouseupHandler1);
              $("body").off("mouseenter", this.mouseenterHandler1);
            }
          })
          .on("mouseenter", (this as any).mouseenterHandler1 = function (e) {
            //buttons = 0 means mouse is up
            if (onMove && e.buttons == 0) {
              onMove = false;
              mouseX0 = null;
              mouseY0 = null;
              offsetX0 = null;
              offsetY0 = null;
              self.$rootElement.removeClass("canmove");
              $("body").off("mousemove", this.mousemoveHandler1);
              $("body").off("mouseup", this.mouseupHandler1);
              $("body").off("mouseenter", this.mouseenterHandler1);
            }
          })
      });
    }
  }
  createResizer() {
    let self = this;
    if (this.cfg.canResize) {
      let onMove = false;
      let mouseX0;
      let mouseY0;
      let offsetX0;
      let offsetY0;
      let width0;
      let height0;
      this.$rootElement.append('<div class="es-modal-corner-lefttop"></div>\
          <div class="es-modal-corner-leftbottom"></div>\
          <div class="es-modal-corner-righttop"></div>\
          <div class="es-modal-corner-rightbottom"></div>\
          <div class="es-modal-line-top"></div>\
          <div class="es-modal-line-right"></div>\
          <div class="es-modal-line-bottom"></div>\
          <div class="es-modal-line-left"></div>');
      self.$rootElement.addClass("canresize");
      //Jquery version is 1.8 ,could not use "add" method
      let $collection = $("");
      let $ele1 = this.$rootElement.find(".es-modal-corner-lefttop")[0];
      let $ele2 = this.$rootElement.find(".es-modal-corner-leftbottom")[0];
      let $ele3 = this.$rootElement.find(".es-modal-corner-righttop")[0];
      let $ele4 = this.$rootElement.find(".es-modal-corner-rightbottom")[0];
      let $ele5 = this.$rootElement.find(".es-modal-line-top")[0];
      let $ele6 = this.$rootElement.find(".es-modal-line-bottom")[0];
      let $ele7 = this.$rootElement.find(".es-modal-line-left")[0];
      let $ele8 = this.$rootElement.find(".es-modal-line-right")[0];
      $collection.length = 8;
      $collection[0] = $ele1;
      $collection[1] = $ele2;
      $collection[2] = $ele3;
      $collection[3] = $ele4;
      $collection[4] = $ele5;
      $collection[5] = $ele6;
      $collection[6] = $ele7;
      $collection[7] = $ele8;
      //logger.dev($collection);
      $collection.on(JQ_EVENT.mousedown, function (e0) {
        let self2 = this;
        onMove = true;
        mouseX0 = e0.pageX;
        mouseY0 = e0.pageY;
        offsetX0 = self.$rootElement[0].getBoundingClientRect().left;
        offsetY0 = self.$rootElement[0].getBoundingClientRect().top;
        width0 = self.$rootElement.width();
        height0 = self.$rootElement.height();
        self.$rootElement.addClass("onmove");
        $("body")
          .on("mousemove", (this as any).mousemoveHandler1 = function (e) {
            if (onMove) {
              let mouseX1 = e.pageX;
              let mouseY1 = e.pageY;
              let offsetX1 = offsetX0 + (mouseX1 - mouseX0);
              let offsetY1 = offsetY0 + (mouseY1 - mouseY0);
              let width1;
              let height1;
              offsetX1 = offsetX1 >= 0 ? offsetX1 : 0;
              offsetY1 = offsetY1 >= 0 ? offsetY1 : 0;
              if ($(self2).hasClass("es-modal-corner-lefttop")) {
                width1 = width0 - (mouseX1 - mouseX0);
                height1 = height0 - (mouseY1 - mouseY0);
                width1 = width1 >= self.cfg.resizeMinWidth ? width1 : self.cfg.resizeMinWidth;
                height1 = height1 >= self.cfg.resizeMinHeight ? height1 : self.cfg.resizeMinHeight;
                offsetX1 = offsetX1 <= (offsetX0 + width0 - self.cfg.resizeMinWidth) ? offsetX1 : (offsetX0 + width0 - self.cfg.resizeMinWidth);
                offsetY1 = offsetY1 <= (offsetY0 + height0 - self.cfg.resizeMinHeight) ? offsetY1 : (offsetY0 + height0 - self.cfg.resizeMinHeight);
                self.$rootElement.css({
                  left: offsetX1 + "px",
                  top: offsetY1 + "px",
                  width: width1 + "px",
                  height: height1 + "px"
                })
              }
              else if ($(self2).hasClass("es-modal-corner-leftbottom")) {
                width1 = width0 - (mouseX1 - mouseX0);
                height1 = height0 + (mouseY1 - mouseY0);
                width1 = width1 >= self.cfg.resizeMinWidth ? width1 : self.cfg.resizeMinWidth;
                height1 = height1 >= self.cfg.resizeMinHeight ? height1 : self.cfg.resizeMinHeight;
                offsetX1 = offsetX1 <= (offsetX0 + width0 - self.cfg.resizeMinWidth) ? offsetX1 : (offsetX0 + width0 - self.cfg.resizeMinWidth);
                self.$rootElement.css({
                  left: offsetX1 + "px",
                  width: width1 + "px",
                  height: height1 + "px"
                })
              }
              else if ($(self2).hasClass("es-modal-corner-righttop")) {
                width1 = width0 + (mouseX1 - mouseX0);
                height1 = height0 - (mouseY1 - mouseY0);
                width1 = width1 >= self.cfg.resizeMinWidth ? width1 : self.cfg.resizeMinWidth;
                height1 = height1 >= self.cfg.resizeMinHeight ? height1 : self.cfg.resizeMinHeight;
                offsetY1 = offsetY1 <= (offsetY0 + height0 - self.cfg.resizeMinHeight) ? offsetY1 : (offsetY0 + height0 - self.cfg.resizeMinHeight);
                self.$rootElement.css({
                  top: offsetY1 + "px",
                  width: width1 + "px",
                  height: height1 + "px"
                })
              }
              else if ($(self2).hasClass("es-modal-corner-rightbottom")) {
                width1 = width0 + (mouseX1 - mouseX0);
                height1 = height0 + (mouseY1 - mouseY0);
                width1 = width1 >= self.cfg.resizeMinWidth ? width1 : self.cfg.resizeMinWidth;
                height1 = height1 >= self.cfg.resizeMinHeight ? height1 : self.cfg.resizeMinHeight;
                self.$rootElement.css({
                  width: width1 + "px",
                  height: height1 + "px"
                })
              }
              else if ($(self2).hasClass("es-modal-line-top")) {
                height1 = height0 - (mouseY1 - mouseY0);
                height1 = height1 >= self.cfg.resizeMinHeight ? height1 : self.cfg.resizeMinHeight;
                offsetY1 = offsetY1 <= (offsetY0 + height0 - self.cfg.resizeMinHeight) ? offsetY1 : (offsetY0 + height0 - self.cfg.resizeMinHeight);
                self.$rootElement.css({
                  top: offsetY1 + "px",
                  height: height1 + "px"
                })
              }
              else if ($(self2).hasClass("es-modal-line-bottom")) {
                height1 = height0 + (mouseY1 - mouseY0);
                height1 = height1 >= self.cfg.resizeMinHeight ? height1 : self.cfg.resizeMinHeight;
                self.$rootElement.css({
                  height: height1 + "px"
                })
              }
              else if ($(self2).hasClass("es-modal-line-left")) {
                width1 = width0 - (mouseX1 - mouseX0);
                width1 = width1 >= self.cfg.resizeMinWidth ? width1 : self.cfg.resizeMinWidth;
                offsetX1 = offsetX1 <= (offsetX0 + width0 - self.cfg.resizeMinWidth) ? offsetX1 : (offsetX0 + width0 - self.cfg.resizeMinWidth);
                self.$rootElement.css({
                  left: offsetX1 + "px",
                  width: width1 + "px",
                })
              }
              else if ($(self2).hasClass("es-modal-line-right")) {
                width1 = width0 + (mouseX1 - mouseX0);
                width1 = width1 >= self.cfg.resizeMinWidth ? width1 : self.cfg.resizeMinWidth;
                self.$rootElement.css({
                  width: width1 + "px",
                })
              }
            }
          })
          .on("mouseup", (this as any).mouseupHandler1 = function (e) {
            if (onMove) {
              onMove = false;
              mouseX0 = null;
              mouseY0 = null;
              offsetX0 = null;
              offsetY0 = null;
              self.$rootElement.removeClass("onmove");
              $("body").off("mousemove", this.mousemoveHandler1);
              $("body").off("mouseup", this.mouseupHandler1);
              $("body").off("mouseenter", this.mouseenterHandler1);
            }
          })
          .on("mouseenter", (this as any).mouseenterHandler1 = function (e) {
            //buttons = 0 means mouse is up
            if (onMove && e.buttons == 0) {
              onMove = false;
              mouseX0 = null;
              mouseY0 = null;
              offsetX0 = null;
              offsetY0 = null;
              self.$rootElement.removeClass("onmove");
              $("body").off("mousemove", this.mousemoveHandler1);
              $("body").off("mouseup", this.mouseupHandler1);
              $("body").off("mouseenter", this.mouseenterHandler1);
            }
          })
      });
    }
    else {
      self.$rootElement.removeClass("canresize");
    }
  }
  destroy() {
    $(this.cfg.container).find(".es-modal-backdrop[modal-index=" + this.index + "]").remove();
    $(this.cfg.container).find(".es-modal[modal-index=" + this.index + "]").remove();
    this.cfg.onDestroy();
  }
}

/**
 * 
 */
export interface EsModalCfg {
  content: string;
  container?: HTMLElement;
  title: string | false;
  /**
   * If set to false ,will not show close button.
   */
  closeBtn: boolean;
  closeBtnType: number;
  showCloseBtnOnHover: boolean;
  width: string;
  height: string;
  offset: ["" | "auto" | number, "" | "auto" | number];
  canMove: boolean;
  canResize: boolean;
  resizeMinWidth: number;
  resizeMinHeight: number;
  showBackDrop: number;
  backDropClickClose: boolean;
  customCssClasses: string[];
  onshow: () => void;
  onDestroy: () => void;
}