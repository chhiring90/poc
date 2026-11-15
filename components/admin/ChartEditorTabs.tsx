"use client";

import { useState } from "react";
import type { ClientTab, TabsFieldClientComponent } from "payload";
import { RenderFields, useFormFields } from "@payloadcms/ui";
import { getFieldPaths } from "payload/shared";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ChartEditorTabs: TabsFieldClientComponent = ({
  field,
  forceRender,
  indexPath = "",
  parentPath = "",
  parentSchemaPath = "",
  path,
  permissions,
  readOnly,
  schemaPath = "",
}) => {
  const tabs = field.tabs as ClientTab[];
  const tabConditions = useFormFields(([fields]) =>
    tabs.map((tab) => ({
      id: tab.id,
      visible: tab.id ? fields[tab.id]?.passesCondition !== false : true,
    })),
  );
  const visibleTabs = tabs.filter((tab, index) => tabConditions[index]?.visible);
  const [activeId, setActiveId] = useState(
    () => visibleTabs[0]?.id ?? visibleTabs[0]?.label?.toString() ?? "",
  );
  const activeTab =
    visibleTabs.find((tab) => (tab.id ?? tab.label?.toString()) === activeId) ??
    visibleTabs[0];

  if (!activeTab) return null;

  const tabValue = (tab: ClientTab) => tab.id ?? tab.label?.toString() ?? "";
  const tabIndex = tabs.indexOf(activeTab);
  const paths = getFieldPaths({
    field: activeTab,
    index: tabIndex,
    parentIndexPath: indexPath,
    parentPath: path || parentPath,
    parentSchemaPath: schemaPath || parentSchemaPath,
  });

  return (
    <Tabs
      value={tabValue(activeTab)}
      onValueChange={setActiveId}
      className="my-4"
    >
      <TabsList aria-label="Chart settings">
        {visibleTabs.map((tab) => (
          <TabsTrigger key={tabValue(tab)} value={tabValue(tab)}>
            {tab.label?.toString()}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={tabValue(activeTab)}>
        <RenderFields
          fields={activeTab.fields}
          forceRender={forceRender}
          margins="small"
          parentIndexPath={paths.indexPath}
          parentPath={paths.path}
          parentSchemaPath={paths.schemaPath}
          permissions={permissions ?? {}}
          readOnly={readOnly}
        />
      </TabsContent>
    </Tabs>
  );
};
