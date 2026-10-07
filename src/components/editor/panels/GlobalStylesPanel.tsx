"use client";

import { useEditor } from "../SiteConfigContext";
import { Panel, ColorField } from "../ui/primitives";

export function GlobalStylesPanel() {
  const { config, patchTheme } = useEditor();
  return (
    <Panel title="2. Styles Globaux" accent="purple">
      <ColorField
        label="Titres"
        value={config.meta.theme.featureTitleColor}
        fallback="#111111"
        onChange={(hex) => patchTheme({ featureTitleColor: hex })}
        withTextInput
      />
    </Panel>
  );
}