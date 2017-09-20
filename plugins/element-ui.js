import Vue from 'vue'
import {
  Button, Input, Select, Pagination,
  Row, Col, Dialog, Checkbox, CheckboxGroup,
  Option, Autocomplete, Tag
} from 'element-ui'
import 'element-ui/lib/theme-default/index.css'

import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'

locale.use(lang)

Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(Select.name, Select)
Vue.component(Pagination.name, Pagination)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Dialog.name, Dialog)
Vue.component(Checkbox.name, Checkbox)
Vue.component(CheckboxGroup.name, CheckboxGroup)
Vue.component(Option.name, Option)
Vue.component(Autocomplete.name, Autocomplete)
Vue.component(Tag.name, Tag)
