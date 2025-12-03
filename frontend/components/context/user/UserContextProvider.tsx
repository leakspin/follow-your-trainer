'use client'

import React, { useState } from "react";
import { AppState, UserContext } from "./UserContext";

interface Props {
  children: React.ReactNode;
}

/**
 * The main context provider
 */
export const UserContextProvider: React.FunctionComponent<Props> = (
  props: Props
): JSX.Element => {

  /**
   * Using react hooks, set the default state
   */
  const [state, setState] = useState({});

  const [loading, setLoading] = useState(true)

  /**
   * Declare the update state method that will handle the state values
   */
  const updateState = (newState: Partial<AppState>) => {
    setState({ ...state, ...newState });
  };

  const updateLoading = (newLoading: boolean) => {
    setLoading(newLoading);
  };

  /**
   * Context wrapper that will provider the state values to all its children nodes
   */
  return (
    <UserContext.Provider value={{ ...state, updateState, loading, updateLoading }}>
      {props.children}
    </UserContext.Provider>
  );
};