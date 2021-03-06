import * as React from "react";
import { unstable_mergeProps } from "../utils/mergeProps";
import { unstable_createComponent } from "../utils/createComponent";
import { RoverOptions, RoverHTMLProps, useRover } from "../Rover/Rover";
import { unstable_createHook } from "../utils/createHook";
import { getTabId, getTabPanelId } from "./__utils";
import { useTabState, TabStateReturn } from "./TabState";

export type TabOptions = RoverOptions &
  Pick<Required<RoverOptions>, "stopId"> &
  Pick<Partial<TabStateReturn>, "manual"> &
  Pick<TabStateReturn, "unstable_baseId" | "selectedId" | "select">;

export type TabHTMLProps = RoverHTMLProps;

export type TabProps = TabOptions & TabHTMLProps;

export const useTab = unstable_createHook<TabOptions, TabHTMLProps>({
  name: "Tab",
  compose: useRover,
  useState: useTabState,

  useOptions({ focusable = true, ...options }) {
    return { focusable, ...options };
  },

  useProps(options, htmlProps) {
    const selected = options.selectedId === options.stopId;

    const onClick = React.useCallback(() => {
      if (!options.disabled && !selected) {
        options.select(options.stopId);
      }
    }, [options.disabled, selected, options.select, options.stopId]);

    const onFocus = React.useCallback(() => {
      if (!options.disabled && !options.manual && !selected) {
        options.select(options.stopId);
      }
    }, [
      options.disabled,
      options.manual,
      selected,
      options.select,
      options.stopId
    ]);

    return unstable_mergeProps(
      {
        role: "tab",
        id: getTabId(options.stopId, options.unstable_baseId),
        "aria-selected": selected,
        "aria-controls": getTabPanelId(options.stopId, options.unstable_baseId),
        onClick,
        onFocus
      } as TabHTMLProps,
      htmlProps
    );
  }
});

export const Tab = unstable_createComponent({ as: "button", useHook: useTab });
