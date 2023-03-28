import { ScopeContext, Scope } from "../scope.ts";
import { Children, Component } from "./component.ts";
import { Fragment } from "./fragment.ts";
import { Renderer, Rendering } from "./renderer.ts";
import { RendererScope } from "./renderer_scope.ts";

export interface ProviderProps<T, R extends Renderer = any> {
  value: T;
  children?: Children<R>;
}

export interface Context<T> extends ScopeContext<T> {
  Provider: new <R extends Renderer>(props: ProviderProps<T, R>) => Component<
    ProviderProps<T>,
    R
  >;
}

export function createContext<T>(): Context<T | undefined>;
export function createContext<T>(defaultValue: T): Context<T>;
export function createContext<T>(defaultValue?: T): Context<T | undefined> {
  const context = Scope.context(defaultValue);

  return Object.assign(context, {
    Provider: class Provider<R extends Renderer> extends Component<
      ProviderProps<T | undefined>,
      R
    > {
      render(s: RendererScope<R>): Rendering<R> {
        let result: Rendering<R>;

        s.context(context, this.props.value, () => {
          result = new Fragment<R>({
            children: this.props.children,
          }).render(s);
        });

        return result!;
      }
    },
  });
}