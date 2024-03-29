import type { FunctionalComponent } from "../component.js";
import type { Template } from "../renderer.js";
import { MaybeSignal } from "../scope.js";
import { Dynamic } from "./Dynamic.js";

/**
 * `If` is a component that can be used to render conditionally.
 *
 * For a more generic version of this component, see {@link Dynamic}.
 */
export const If: FunctionalComponent<{
  condition?: MaybeSignal<boolean | undefined>;
  then?: Template;
  else?: Template;
}> = (props) =>
  Dynamic({
    render: () => (MaybeSignal.get(props.condition) ? props.then : props.else),
  });
