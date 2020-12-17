import { JQ_KEY } from "../cons";
import { isFunction } from "../utils";
import { EsDropdownLayerComponent } from "./dropdownlayer";

/**
 * Create a select component, only used in CMS Cp selector.
 */
export class EsDropdownSelectComponent {
  $rootElement: JQuery;
  $select: JQuery;
  $flag: JQuery;
  $items: JQuery;
  $searchInput: JQuery;
  $dropdown: JQuery;
  options: Option[];
  popupComponent: EsDropdownLayerComponent;
  searchFlag;
  customOnSelect: Function;
  constructor(cfg) {
    this.$rootElement = null;
    this.$select = $("#" + cfg.selectId);
    if (this.$select.length == 0) {
      console.log("Target select id can not be found");
      return;
    }
    this.customOnSelect = isFunction(cfg.onselect) ? cfg.onselect : null;
    this.$select.hide();
    this.getOptions(this.$select);
    this.createWrap(this.$select);
    this.createDefaultItem(this.$select, this.options);
    this.bindClickEvent();
    this.createDropdown(this.$select, this.options);
    return this;
  }
  createWrap($select) {
    //$rootElement must be "a" element, or will affect $rootElement.keydown
    $select.wrap('<a href="javascript:;" class="es-select"></a>');
    this.$rootElement = $select.parents(".es-select");
    this.$rootElement.css("width", $select.outerWidth() + "px");
  }
  getOptions($select): Option[] {
    let options: Option[] = [];
    $select.find("option").each(function () {
      let text = $.trim($(this).text());
      let value = $(this).attr("value");
      let disabled = $(this).attr("disabled");
      options.push({
        text: text,
        value: value,
        disabled: new Boolean(disabled).valueOf()
      })
    });
    this.options = options;
    return options;
  }
  createDropdown($select, options: Option[]) {
    let self = this;
    let htm = "";
    htm += '<div class="es-select-dropdown">';
    htm += '<div class="es-dropdown-search-wrap" tabIndex="1"><input class="es-dropdown-search"  type="text" placeholder="Search"></div>';
    htm += '<div style="padding: 0 5px 10px;">'
    htm += '<div class="es-select-dropdown-item-wrap">';
    htm += '<div class="es-select-dropdown-flag"></div>';
    for (let i = 0; i < options.length; i++) {
      if (options[i].disabled) {
        htm += '<div class="es-select-dropdown-item disabled" data-value="' + options[i].value + '">' + options[i].text + '</div>';
      }
      else {
        htm += '<div class="es-select-dropdown-item" data-value="' + options[i].value + '">' + options[i].text + '</div>';
      }
    }
    htm += '</div></div></div>';
    this.popupComponent = new EsDropdownLayerComponent({
      targetElement: $select.parents(".es-select")[0],
      content: htm,
      onShow: function () {
        self.$rootElement.addClass("active");
        self.$flag = self.$rootElement.find(".es-select-dropdown-flag");
        self.$items = self.$rootElement.find(".es-select-dropdown-item");
        for (let i = 0; i < self.$items.length; i++) {
          if (self.$items.eq(i).attr("data-value") == self.$select.val()) {
            self.$items.eq(i).addClass("active");
            self.setFlagPosition(self.$items.eq(i));
            break;
          }
        }
        self.bindItemClickEvent();
        self.$searchInput = self.$rootElement.find(".es-dropdown-search");
        self.$dropdown = self.$rootElement.find(".es-select-dropdown");
        self.bindItemKeydownEvent();
        self.bindSearchInputKeydownEvent();
        setTimeout(function () {
          self.$dropdown.find(".es-dropdown-search").focus();
        }, 100)
      },
      onDestroy: function () {
        self.$rootElement.removeClass("active");
      }
    });
  }
  bindClickEvent() {
    let self = this;
    this.$rootElement.find(".es-select-default-container").click(function () {
      self.show();
    });
  }
  bindItemClickEvent() {
    let self = this;
    self.$rootElement.find(".es-select-dropdown-item").click(function (e) {
      let val = $(this).attr("data-value");
      let text = "";
      let cOption = self.filterOptionByValue(val);
      e.stopPropagation();
      if ($(this).hasClass("disabled")) return;
      self.hide();
      if (self.$select.val() != $(this).attr("data-value")) {
        text = cOption ? cOption.text : "";
        self.$select.val(val);
        self.$rootElement.find(".es-select-default").html(text).attr("data-value", val);
        if (isFunction(self.customOnSelect)) {
          self.customOnSelect();
        }
      }
    });
  }
  bindSearchInputKeydownEvent() {
    let self = this;
    this.$searchInput.keydown(function (e) {
      if (e.key != JQ_KEY.esc &&
        e.key != JQ_KEY.up &&
        e.key != JQ_KEY.down &&
        e.key != JQ_KEY.enter) {
        clearTimeout(self.searchFlag);
        self.searchFlag = setTimeout(function () {
          for (let i = 0; i < self.$items.length; i++) {
            if ($.trim(self.$items.eq(i).text()).toLowerCase().indexOf((self.$searchInput.val() as string).toLowerCase()) >= 0) {
              self.$items.eq(i).show();
            }
            else {
              self.$items.eq(i).hide();
            }
            let $item = C.tools.findNextNotDisabledItem(-1, self.getVisibleItems());
            if ($item) {
              self.$flag.show();
              self.setFlagPosition($item);
              $item.addClass("active").siblings(".es-select-dropdown-item").removeClass("active");
            }
            else {
              self.$flag.hide();
              self.$items.removeClass("active");
            }
          }
        }, 300);
      }
    })
  }
  bindItemKeydownEvent() {
    let self = this;
    this.$rootElement.find(".es-select-dropdown").on("keydown", function (e) {
      if (e.key == JQ_KEY.esc) {
        self.hide();
      }
      else if (e.key == JQ_KEY.up) {
        let visibleItems = self.getVisibleItems();
        let i = visibleItems.index(self.$rootElement.find(".es-select-dropdown-item.active:visible"));
        let prev = C.tools.findPrevNotDisabledItem(i, visibleItems);
        e.preventDefault();
        if (prev && !prev.hasClass("disabled")) {
          self.$flag.show();
          self.setFlagPosition(prev);
          prev.addClass("active").siblings(".es-select-dropdown-item").removeClass("active");
        }
      }
      else if (e.key == JQ_KEY.down) {
        // eslint-disable-next-line no-redeclare
        let visibleItems = self.getVisibleItems();
        // eslint-disable-next-line no-redeclare
        let i = visibleItems.index(self.$rootElement.find(".es-select-dropdown-item.active:visible"));
        let next = C.tools.findNextNotDisabledItem(i, visibleItems);
        e.preventDefault();
        if (next && !next.hasClass("disabled")) {
          self.$flag.show();
          self.setFlagPosition(next);
          next.addClass("active").siblings(".es-select-dropdown-item").removeClass("active");
        }
      }
      else if (e.key == JQ_KEY.enter) {
        // eslint-disable-next-line no-redeclare
        for (let i = 0; i < self.$items.length; i++) {
          if (self.$items.eq(i).hasClass("active")) {
            self.$items.eq(i).click();
          }
        }
      }
    })
  }
  filterOptionByValue(val) {
    let ret = null;
    for (let i = 0; i < this.options.length; i++) {
      if (val == this.options[i].value) {
        ret = this.options[i];
        break;
      }
    }
    return ret;
  }
  createDefaultItem($select, options: Option[]) {
    let val = $select.val();
    let text = "";
    for (let i = 0; i < options.length; i++) {
      if (val == options[i].value) {
        text = options[i].text;
        break;
      }
    }
    let htm = "";
    htm += '<div class="es-select-default-container">';
    htm += '<span class="es-select-arrow"><span class="iconfont icon-ag-d"></span></span>';
    htm += '<div class="es-select-default" data-value="' + val + '">';
    htm += text;
    htm += '</div>'
    htm += '</div>'
    $select.after(htm);
  }
  getVisibleItems() {
    return this.$rootElement.find(".es-select-dropdown-item:visible");
  }
  setFlagPosition($item: JQuery) {
    this.$flag.css({
      "transform": "translateY(" + ($item[0].offsetTop + $item.outerHeight() / 2 - this.$flag.outerHeight() / 2) + "px)"
    })
  }
  show() {
    this.popupComponent.show();
  }
  hide() {
    if (this.popupComponent != null) {
      this.popupComponent.hide();
    }
  }
  checkIsShow() {
    return this.$rootElement.find(".es-popup").length > 0;
  }
  toggle() {
    if (this.checkIsShow()) {
      this.hide();
    }
    else {
      this.show();
    }
  }
  static tools = {
    findPrevNotDisabledItem: function (from: number, $items: JQuery) {
      if (from - 1 > -1) {
        if ($items.eq(from - 1).hasClass("disabled")) {
          return C.tools.findPrevNotDisabledItem(from - 1, $items);
        } else {
          return $items.eq(from - 1);
        }
      } else {
        return null;
      }
    },
    findNextNotDisabledItem: function (from: number, $items: JQuery) {
      if (from + 1 < $items.length) {
        if ($items.eq(from + 1).hasClass("disabled")) {
          return C.tools.findNextNotDisabledItem(from + 1, $items);
        } else {
          return $items.eq(from + 1);
        }
      } else {
        return null;
      }
    }

  }
}

const C = EsDropdownSelectComponent;

interface Option {
  text: string,
  value: string,
  disabled: boolean
}