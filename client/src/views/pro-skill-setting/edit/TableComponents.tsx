/* eslint-disable lines-around-comment */
import { Table } from 'antd';
import { t } from 'i18next';
import ColumnsComponents from './components/ColumnsComponents';
import { DataSourceEditProSkill } from '../../../page/detail-pro-skill/interfaces/Interfaces';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import React, { memo } from 'react';
import { MenuOutlined } from '@ant-design/icons';
interface Props {
  setDataSources: any;
  dataSources: DataSourceEditProSkill;
  startTransition: any;
  setSelectRowsKeys: any;
  setSelectRecord: any;
  breaks: any;
  selectedRowKeys: any;
  isLoading: boolean;
  listPoints: {
    id: number;
    versionId: number;
    note: string;
    point: number;
  }[];
  setDrop: any;
  isDrop: boolean;
}
interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

// const Row = (props: RowProps) => {
//   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
//     id: props['data-row-key'],
//   });

//   const style: React.CSSProperties = {
//     ...props.style,
//     transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
//     transition,
//     cursor: 'move',
//     ...(isDragging ? { position: 'relative' } : {}),
//   };

//   return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
// };

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
const TableComponents = (props: Props) => {
  const {
    setDataSources,
    dataSources,
    startTransition,
    selectedRowKeys,
    setSelectRowsKeys,
    setSelectRecord,

    breaks,
    isLoading,
    listPoints,
  } = props;

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    props.setDrop(!props.isDrop);
    if (active.id !== over?.id) {
      setDataSources({
        ...dataSources,
        data: {
          ...dataSources.data,
          children: newArr(dataSources.data.children, active, over),
        },
      });
    }
  };

  return (
    <>
      {/* <DndContext sensors={sensors} modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
       */}
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={dataSources.data.children.map((i: any) => i.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            components={{
              body: {
                row: Row,
              },
            }}
            size="small"
            columns={ColumnsComponents({
              setDataSources: setDataSources,
              dataSources: dataSources.data,
              startTransition: startTransition,
              sources: dataSources,
              listPoints: listPoints,
            })}
            dataSource={dataSources.data.children}
            pagination={false}
            rowSelection={{
              selectedRowKeys: selectedRowKeys,
              type: 'checkbox',
              // selections: true,
              // columnTitle: t('IDS_SELECTION'),
              columnWidth: '2%',
              onChange(selectedRowKeys, selectedRows, _info) {
                setSelectRowsKeys(selectedRowKeys);
                setSelectRecord(selectedRows);
              },
            }}
            loading={isLoading}
            locale={{
              emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA'),
            }}
            bordered
            scroll={{ x: breaks.xs || breaks.sm ? 900 : undefined, y: 700 }}
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

export default memo(TableComponents, (next, prev) => {
  return !(
    next.selectedRowKeys !== prev.selectedRowKeys ||
    next.dataSources.data.children !== prev.dataSources.data.children ||
    next.isLoading !== prev.isLoading
  );
});
