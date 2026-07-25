declare module '@builder.io/partytown/react' {
  import * as React from 'react';
  
  export interface PartytownProps {
    debug?: boolean;
    forward?: string[];
    lib?: string;
    mainWindowAccessors?: string[];
    resolveUrl?: (url: URL, location: Location, type: string) => URL | undefined | null;
    loadScriptsOnMainThread?: string[];
  }

  export const Partytown: React.ComponentType<PartytownProps>;
}
