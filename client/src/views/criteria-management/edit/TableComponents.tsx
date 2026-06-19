import { Table, Grid } from 'antd';
import ColumnComponent from './components/ColumnComponent';
import { TablePropsComponent } from './interfaces/interfacesProps';
import { t } from 'i18next';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import React from 'react';
import { MenuOutlined } from '@ant-design/icons';

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row = ({ children, ...props }: RowProps) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative' } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === 'sort') {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined ref={setActivatorNodeRef} style={{ touchAction: 'none', cursor: 'move' }} {...listeners} />
            ),
          });
        }

        return child;
      })}
    </tr>
  );
};

const TableComponent = (props: TablePropsComponent) => {
  const {
    dataSources,
    selectedRowKeys,
    setSelectRowsKeys,
    setSelectRecord,
    setDataSource,
    listPoints,
    setDataSourcesParent,
    dataSourcesParent,
  } = props;
  const breaks = Grid.useBreakpoint();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setDataSourcesParent({
        ...dataSourcesParent,
        data: {
          ...dataSourcesParent.data,

          children: newArr(dataSourcesParent.data.children, active, over),
        },
      });
    }
  };

  return (
    <>
      <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={dataSourcesParent.data.children.map((i: any) => i.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            components={{
              body: {
                row: Row,
              },
            }}
            size="small"
            locale={{
              emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
            }}
            columns={ColumnComponent({ setDataSource: setDataSource, listPoints })}
            dataSource={dataSources.children}
            pagination={false}
            scroll={{ x: breaks.xs ? 900 : undefined }}
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              selections: true,
              type: 'checkbox',
              columnTitle: t('IDS_SELECTION'),
              columnWidth: 50,
              onChange(selectedRowKeys, selectedRows, _info) {
                setSelectRowsKeys(selectedRowKeys);
                setSelectRecord(selectedRows);
              },
            }}
            bordered
          />
        </SortableContext>
      </DndContext>
    </>
  );
};
function newArr(prev: any, active: any, over: any) {
  const activeIndex = prev.findIndex((i: any) => i.key === active.id);
  const overIndex = prev.findIndex((i: any) => i.key === over?.id);

  return arrayMove(prev, activeIndex, overIndex);
}
export default TableComponent;
