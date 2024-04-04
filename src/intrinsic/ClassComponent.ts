import {
  jsxPropsSym,
  ComponentConstructor,
  JsxProps,
  Metadata,
  componentSym,
} from "../component.js";
import { useRenderer } from "../renderer.js";
import { useScope } from "../scope.js";
import { createTemplate } from "../template.js";

export const ClassComponent = <M extends Metadata>(
  type: ComponentConstructor<M>,
  props: JsxProps<M>,
) =>
  createTemplate(() => {
    const node = useRenderer()._node(() => new type());
    customElements.upgrade(node);

    node[componentSym]._parentScope = useScope();
    node[jsxPropsSym] = props;

    return [node];
  });
