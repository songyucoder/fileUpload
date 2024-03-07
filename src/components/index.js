
import FileOperate from './FileOperate/FileOperate.vue'

const components = {
      FileOperate
};

function install(Vue) {
  const keys = Object.keys(components);
  keys.forEach((name) => {
    const component = components[name];
    Vue.component(component.name || name, component);
  });
}

export default {
  install,
  ...components,
}
