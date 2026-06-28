# UI RULE — Evaluation System
> Nguồn chuẩn: `admin-evaluation/list-user-evaluation` · `admin-evaluation/period-evaluation-detail-v2`  
> Tham chiếu Excel: `Rule code.xlsx` → Cột E [Đề xuất rule common mới]  
> Áp dụng cho: tất cả màn hình trong danh sách `Rule code.xlsx` mục 2

---

## MỤC LỤC

1. [Typography](#1-typography)
2. [Spacing System](#2-spacing-system)
3. [Color](#3-color)
4. [Form](#4-form)
5. [Input Controls](#5-input-controls)
6. [Button](#6-button)
7. [Table](#7-table)
8. [Tooltip](#8-tooltip)
9. [Tab Panel](#9-tab-panel)
10. [Modal — Form / Content](#10-modal--form--content)
11. [Modal — Result / Notify](#11-modal--result--notify)
12. [Popup Confirm — ModalCustomComponent](#12-popup-confirm--modalcustomcomponent)
13. [Popup Confirm — Modal.confirm (phức tạp)](#13-popup-confirm--modalconfirm-phức-tạp)
14. [Page Layout](#14-page-layout)

---

## 1. Typography

### 1.1 Tiêu đề trang (Page Title)
```tsx
<Typography.Title level={3}>
  {t('PAGE_TITLE')}
</Typography.Title>
```

| Thuộc tính   | Giá trị                        |
|--------------|-------------------------------|
| Component    | `Typography.Title level={3}`  |
| Font size    | `24px` (do Ant Design level=3)|
| Font weight  | `700` (bold)                  |
| Color        | `#007240` — do `Typography.css` global |
| Padding bottom | `20px` — do `Typography.css` global |
| Margin bottom | `0` — do `Typography.css` global |

> ✅ **Không thêm inline style** — tất cả đã có trong `client/src/common/css/Typography.css`

### 1.2 Tiêu đề Modal
```tsx
<Typography.Title level={4} style={{ paddingBottom: 15, marginBottom: 0 }}>
  <IconComponent style={{ color: '#007240', marginRight: 8 }} />
  {t('MODAL_TITLE')}
</Typography.Title>
```

| Thuộc tính    | Giá trị              |
|---------------|---------------------|
| Component     | `Typography.Title level={4}` |
| Font size     | `20px`              |
| Color         | `#007240`           |
| Padding bottom | `15px` (spacing đến nội dung modal) |
| Margin bottom | `0`                 |
| Icon          | Đặt trước text, `color: '#007240'`, `marginRight: 8` |

### 1.3 Tiêu đề Section trong Modal
```tsx
<Typography.Title
  level={5}
  style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}
>
  <IconComponent style={{ color: '#007240' }} />
  {t('SECTION_TITLE')}
</Typography.Title>
```

| Thuộc tính | Giá trị |
|------------|---------|
| Component  | `Typography.Title level={5}` |
| Font size  | `14px` (override) |
| Icon + gap | `gap: 8` |

---

## 2. Spacing System

> **Nguyên tắc chung:** Spacing ở page-level phải là **bội số của 4px**.  
> Dãy được dùng: `4 · 8 · 12 · 16 · 20 · 24px`  
> **Ngoại lệ Modal:** Các màn hình chuẩn `period-evaluation-detail` dùng `15px` cho modal title paddingBottom, footer marginTop, và Row gutter — đây là pattern được chấp nhận trong Modal.

| Token          | Giá trị | Dùng cho                                  |
|----------------|---------|------------------------------------------|
| `--space-1`    | `4px`   | Gap nhỏ trong cell, nội dung dọc         |
| `--space-2`    | `8px`   | Gap giữa icon và text, pagination        |
| `--space-3`    | `12px`  | Gap giữa buttons trên page              |
| `--space-4`    | `16px`  | Padding card/section, Form→Table         |
| `--space-5`    | `20px`  | Page header marginBottom, section padding |
| `--space-6`    | `24px`  | Khoảng cách lớn giữa các block           |
| Modal specific | `15px`  | Modal title paddingBottom, footer marginTop, Row gutter |

### Bảng quy đổi từ giá trị cũ (ngoài Modal)
| Giá trị cũ | Giá trị mới |
|------------|-------------|
| `5px`      | `4px`       |
| `10px`     | `8px` hoặc `12px` |
| `13px`     | `12px`      |
| `20px`     | `20px` ✅   |
| `30px`     | `28px` hoặc `32px` |

### Spacing cụ thể theo ngữ cảnh
| Ngữ cảnh                              | Giá trị                    |
|---------------------------------------|---------------------------|
| Form → Table                          | `20px` (marginBottom)     |
| Table → Pagination                    | `8px`                     |
| Space action icons trong Table cell   | `size="middle"` (semantic)|
| Padding bên trong Section/Card block  | `20px`                    |
| Note/Warning block padding            | `10px`                    |
| Modal footer marginTop                | `15`                      |
| Modal Row gutter                      | `[15, 15]`                |
| Modal title paddingBottom             | `15`                      |

---

## 3. Color

> **Nguyên tắc:** Không hardcode màu trong JSX hoặc CSS component.  
> Tất cả màu phải tham chiếu từ `design-tokens.css` (khi đã tạo) hoặc dùng đúng giá trị bên dưới.

| Token            | Giá trị   | Dùng cho                          |
|------------------|-----------|-----------------------------------|
| Primary          | `#007240` | Button primary, icon, title, border card |
| Primary Dark     | `#025832` | Button primary hover              |
| Primary Light    | `#00a85f` | Button default hover              |
| Border           | `#bababa` | Input border mặc định             |
| Border Focus     | `#00874d` | Input border khi focus/hover      |
| Disabled BG      | `#eaeaea` | Button/Input disabled background  |
| Disabled Text    | `#ccc3c0` | Button/Input disabled text        |
| Sidebar BG       | `#375054` | Sidebar background                |
| Tooltip BG       | `#424242` | Tooltip background                |
| Text Default     | `rgba(0, 0, 0, 0.88)` | Text trong Table cell, Form label |

---

## 4. Form

### 4.1 Cấu hình Form — Search/Filter Screen
```tsx
<Form
  form={form}
  layout="horizontal"          {/* ✅ Màn hình filter dùng horizontal */}
  labelCol={{ span: 1 }}
  labelAlign="left"
  style={{ width: '100%' }}
  colon={false}                {/* ✅ Đặt 1 lần tại Form */}
  onFinish={handleSearch}
>
```

| Prop           | Giá trị        | Ghi chú                                         |
|----------------|---------------|--------------------------------------------------|
| `layout`       | `"horizontal"` | ✅ Màn hình lọc dùng horizontal                 |
| `labelCol`     | `{ span: 1 }` | Căn label trái theo Ant Design horizontal layout |
| `labelAlign`   | `"left"`      |                                                  |
| `colon`        | `false`       | Đặt tại `<Form>` — ưu tiên không lặp ở từng Item |
| `style.width`  | `'100%'`      |                                                  |

> **Lưu ý:** Form search không dùng `<Row gutter>` — layout horizontal của Ant Design tự xử lý căn chỉnh.  
> Nếu cần nhóm nhiều field trên cùng hàng, dùng `<Form.Item>` lồng bên trong `<Space direction="horizontal" size="small">`.

### 4.2 Cấu hình Form — Modal
```tsx
<Form layout="vertical" form={modalForm}>
```

| Prop     | Giá trị      | Ghi chú                  |
|----------|-------------|--------------------------|
| `layout` | `"vertical"` | ✅ Modal dùng vertical   |

### 4.3 Form.Item
```tsx
<Form.Item
  label={t('IDS_FIELD_LABEL')}   {/* ✅ Plain t('...') — không wrap <span style> */}
  name="fieldName"
  style={{ marginBottom: 0 }}    {/* Chỉ override khi cần bỏ spacing dư */}
>
```

| Thuộc tính              | Giá trị             | Ghi chú                                          |
|-------------------------|---------------------|--------------------------------------------------|
| `label`                 | `t('...')` thuần    | ❌ Không dùng `<span style={LABEL_STYLE}>`        |
| `marginBottom` (global) | `5px`               | Từ `FormItem.css` — không cần override inline    |
| `colon`                 | Kế thừa từ Form     | Không cần lặp lại ở từng item                    |

### 4.4 Label Style
- Font size: `14px`
- Color: `rgba(0, 0, 0, 0.88)`
- **Không dùng local const** `LABEL_STYLE` trong từng file — kế thừa Ant Design + CSS global

### 4.5 Row / Col trong Modal Form
```tsx
<Row gutter={[15, 15]}>    {/* ✅ Chuẩn của màn hình period-evaluation-detail */}
  <Col xs={24} sm={12}>
    <Form.Item ... />
  </Col>
</Row>
```

| Prop      | Giá trị    | Ghi chú                                      |
|-----------|-----------|----------------------------------------------|
| `gutter`  | `[15, 15]`| Áp dụng trong Modal — theo chuẩn DeptAddModal |

---

## 5. Input Controls

### 5.1 Kích thước theo ngữ cảnh

| Control      | Search Form   | Modal Form      |
|--------------|--------------|-----------------|
| `Cascader`   | `size="small"` | `size="small"` |
| `DatePicker` | `size="small"` | `size="small"` |
| `RangePicker`| —            | `size="middle"` |
| `Select`     | Không set (default) | Không set |
| `Input`      | `size="small"` | Không set |

> ❌ Không thêm `style={{ fontSize: 14 }}` trên Input/Select/Cascader — CSS global xử lý.

### 5.2 Placeholder
- Font size: `14px` — do CSS global

### 5.3 Input border
- Default: `#bababa`
- Hover/Focus: `#00874d`
- Đã có trong `Input.css` — không cần inline

---

## 6. Button

> ⚠️ **Không dùng `<MainButton>` hoặc `className="main_button"`** — `MainButton.css` dùng `color !important; background-color !important` ghi đè disabled state của Ant Design, khiến button trông enabled khi đã disabled.

### 6.1 Button ngoài Page (Action Bar, Header)
```tsx
{/* Primary action */}
<Button type="primary" size="middle" onClick={...} loading={isLoading} icon={<IconOutlined />}>
  {t('IDS_BUTTON_LABEL')}
</Button>

{/* Default / Cancel */}
<CancelButton size="middle" onClick={...}>
  {t('IDS_BUTTON_CANCEL')}
</CancelButton>

{/* Danger / Delete */}
<Button danger size="middle" onClick={...} loading={isLoading} icon={<DeleteOutlined />}>
  {t('IDS_BUTTON_DELETE')}
</Button>
```

| Loại          | Component              | Props bắt buộc                            |
|---------------|------------------------|-------------------------------------------|
| Primary       | `<Button>`             | `type="primary"`, `size="middle"`, `loading` |
| Submit Form   | `<Button>`             | `type="primary"`, `size="middle"`, `htmlType="submit"` |
| Default/Cancel| `<CancelButton>`       | `size="middle"`                           |
| Danger/Delete | `<Button>`             | `danger`, `size="middle"`, `loading`      |

> ✅ Mọi button đều phải có `size="middle"` — đảm bảo chiều cao đồng nhất  
> ✅ `<CancelButton>` vẫn dùng được vì `.cancel_button` CSS không ghi đè màu nền/chữ bằng `!important`  
> ❌ Không dùng `<Button type="primary" className="main_button">` — gây lỗi disabled state  
> ❌ Không dùng `<MainButton>` — cùng lý do

### 6.2 Button trong Modal (Form Body)
```tsx
<Button type="primary" size="middle" loading={isLoading} onClick={handleSubmit}>
  {t('IDS_APPLY')}
</Button>
<Button size="middle" disabled={isLoading} onClick={handleClose}>
  {t('IDS_BUTTON_CANCEL')}
</Button>
```

| Loại    | Component  | Props                          |
|---------|-----------|-------------------------------|
| Primary | `<Button>` | `type="primary"`, `size="middle"`, `loading` |
| Cancel  | `<Button>` | `size="middle"`, `disabled`   |

### 6.3 Spacing giữa các Button
```tsx
<Space size={12}>
  <Button type="primary" size="middle" ...>...</Button>
  <CancelButton size="middle" ...>...</CancelButton>
</Space>
```
- Gap chuẩn: `12px` (`Space size={12}`)
- ❌ Không dùng `gap: '15px'`, `size={15}`, `size={10}`

---

## 7. Table

### 7.1 Cấu hình Table
```tsx
<Table
  size="small"
  bordered
  pagination={false}
  dataSource={data}
  columns={columns}
  loading={isLoading}
  rowKey={(record) => record.id}
  locale={{ emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA') }}
/>
```

| Prop         | Giá trị    | Ghi chú                        |
|--------------|-----------|-------------------------------|
| `size`       | `"small"` | ✅ Bắt buộc                    |
| `bordered`   | `true`    | ✅ Bắt buộc                    |
| `pagination` | `false`   | Dùng custom Pagination riêng   |
| `locale`     | `{ emptyText: t('...') }` | ✅ Bắt buộc         |

### 7.2 Column Header
```tsx
// ✅ ĐÚNG — plain string
{
  title: t('IDS_FULLNAME'),
  dataIndex: 'name',
  width: '15%',
  align: 'left' as const,
}

// ❌ SAI — không wrap span
{
  title: <span style={{ fontSize: 14 }}>{t('IDS_FULLNAME')}</span>,
}
```

| Thuộc tính       | Giá trị                   |
|------------------|--------------------------|
| Font size header | `14px` — CSS global      |
| Color header     | `#fff`                   |
| Font weight      | `600`                    |
| **Không** inline style | ✅ CSS global xử lý |

### 7.3 Cell Render
```tsx
// ✅ ĐÚNG — không style trên cell
render: (_text, record) => (
  <div>{record.fullName}</div>
)

// ❌ SAI — không dùng CELL_STYLE local const
const CELL_STYLE = { fontSize: 14, color: 'rgba(0,0,0,0.88)' };
render: (_text, record) => (
  <div style={CELL_STYLE}>{record.fullName}</div>
)
```

| Thuộc tính    | Giá trị                        |
|---------------|-------------------------------|
| Font size     | `14px` — CSS global           |
| Color         | `rgba(0,0,0,0.88)` — CSS global |
| **Không** local const `CELL_STYLE` | ✅            |

### 7.4 Space trong Cell (layout dọc)
```tsx
<Space direction="vertical" size={4}>  {/* ✅ bội số 4 */}
  <div>...</div>
  <div>...</div>
</Space>
```
- ❌ Không dùng `size={2}` hoặc `size={5}`

### 7.5 Space trong Action Cell (icon/button ngang hàng)
```tsx
<Space size="middle">   {/* ✅ dùng semantic size — theo chuẩn ListEvaluationTable */}
  <ClockCircleOutlined style={{ cursor: 'pointer', fontSize: 16 }} />
  <EyeTwoTone style={{ cursor: 'pointer', fontSize: 16 }} />
</Space>
```

| Ngữ cảnh              | Size          |
|-----------------------|---------------|
| Icon/button action ngang | `"middle"`  |
| Content dọc trong cell  | `4` (số)     |

- ❌ Không hardcode `color: '#007240'` trên icon — dùng CSS global hoặc TwoTone component

---

## 8. Tooltip

```tsx
<Tooltip
  title={t('IDS_TOOLTIP_CONTENT')}
  color="#424242"
  overlayInnerStyle={{ fontSize: '11px' }}
>
  <Button ...>...</Button>
</Tooltip>
```

| Thuộc tính          | Giá trị         |
|---------------------|----------------|
| `color`             | `#424242`      |
| `overlayInnerStyle` | `{ fontSize: '11px' }` (string có đơn vị) |

---

## 9. Tab Panel

```tsx
<Tabs
  type="card"
  size="small"
  tabPosition="top"
/>
```

| Prop          | Giá trị  |
|---------------|---------|
| `type`        | `"card"` |
| `size`        | `"small"` |
| `tabPosition` | `"top"` |

---

## 10. Modal — Form / Content

> Chuẩn từ `DeptAddModal.tsx` và `DeptEditModal.tsx`

```tsx
<Modal
  title={
    <Typography.Title level={4} style={{ paddingBottom: 15, marginBottom: 0 }}>
      <ApartmentOutlined style={{ color: '#007240', marginRight: '8px' }} />
      {t('MODAL_TITLE')}
    </Typography.Title>
  }
  open={isOpen}
  onCancel={handleClose}          {/* handleClose: reset form + clear state */}
  width={800}                     {/* Explicit width: 600 / 800 / 1000 */}
  footer={null}                   {/* ✅ Không dùng footer mặc định */}
  destroyOnClose                  {/* ✅ Bắt buộc */}
  style={{ top: 20 }}             {/* ✅ Bắt buộc */}
>
  <Form layout="vertical" form={modalForm}>

    {/* ... nội dung form ... */}

    {/* Footer đặt cuối body, KHÔNG dùng prop footer của Modal */}
    <div style={{ marginTop: 15 }}>
      <Space>
        <Button type="primary" size="middle" loading={isLoading} onClick={handleSubmit}>
          {t('IDS_APPLY')}
        </Button>
        <Button size="middle" disabled={isLoading} onClick={handleClose}>
          {t('IDS_BUTTON_CANCEL')}
        </Button>
      </Space>
    </div>

  </Form>
</Modal>
```

| Prop            | Giá trị                   | Bắt buộc |
|-----------------|--------------------------|:--------:|
| `footer`        | `null`                   | ✅        |
| `destroyOnClose`| `true`                   | ✅        |
| `style.top`     | `20`                     | ✅        |
| `width`         | Số cụ thể (600/800/1000) | ✅        |
| `maskClosable`  | `false`                  | ✅        |
| `onCancel`      | Reset form + clear state | ✅        |
| **Title (có icon)** | `<Typography.Title level={4} style={{ paddingBottom: 15, marginBottom: 0 }}><Icon style={{ color: '#007240', marginRight: '8px' }} /> {t('TITLE')}` | ✅ |
| **Title (không icon)** | `<Typography.Title level={4}>{t('TITLE')}</Typography.Title>` | ✅ |

### Spacing trong Modal body
| Ngữ cảnh                          | Giá trị |
|-----------------------------------|---------|
| Modal title `paddingBottom`       | `15` (khi có icon) |
| Modal title `marginBottom`        | `0` (khi có icon) |
| Icon trong title `marginRight`    | `'8px'` (string) |
| Padding nội dung (default Ant)    | `16px` (không override) |
| Form.Item trong cùng nhóm (không phải cuối) | `marginBottom: 5` |
| Form.Item cuối nhóm               | `marginBottom: 0` |
| Giữa các nhóm / section           | `marginBottom: 15` trên wrapper div |
| Form.Item trong Row gutter=[15,15] | `marginBottom: 0` — gutter tự xử lý |
| Nội dung đến footer Action        | `15` (`marginTop: 15`) |
| Row gutter trong Modal            | `[15, 15]` |
| Section background block          | `#F8FAFC`, border `#E2E8F0`, radius `6px`, padding `20px` |
| Note/Warning block                | `#FFFBE6`, padding `10` |

### Pattern footer buttons (bên trong Form body)
```tsx
{/* Luôn căn TRÁI — không dùng textAlign: right */}
<div style={{ marginTop: 15 }}>
  <Space>
    <Button type="primary" size="middle" loading={...} onClick={...}>
      {t('IDS_APPLY')}
    </Button>
    <Button size="middle" disabled={...} onClick={handleClose}>
      {t('IDS_BUTTON_CANCEL')}
    </Button>
  </Space>
</div>
```

---

## 11. Modal — Result / Notify

> Chuẩn từ `TargetSection.tsx` — Modal thông báo kết quả xử lý

```tsx
<Modal
  title={t('POPUP_DIALOG.TITLE.PROCESS_RESULT') as string}  {/* Plain string — không cần Typography */}
  open={isVisible}
  maskClosable={false}                               {/* ✅ Bắt buộc */}
  onCancel={() => setIsVisible(false)}
  footer={
    <Space>                                          {/* ✅ Căn TRÁI — không dùng textAlign: right */}
      <Button size="middle" onClick={() => setIsVisible(false)}>
        {t('IDS_BUTTON_CLOSE')}
      </Button>
    </Space>
  }
>
  <p dangerouslySetInnerHTML={{ __html: content }} />
</Modal>
```

| Prop            | Giá trị            | Ghi chú                             |
|-----------------|-------------------|--------------------------------------|
| `maskClosable`  | `false`           | ✅ Không đóng khi click ngoài         |
| `destroyOnClose`| Không cần         | Chỉ hiện text thuần                  |
| `title`         | Plain string      | Không wrap `<Typography.Title>`      |
| `footer`        | `<Space><Button size="middle">...</Button></Space>` | ✅ Căn **trái** (Space default) |
| `style`         | Không set         | Dùng vị trí mặc định (centered)      |

---

## 12. Popup Confirm — ModalCustomComponent

> Dùng cho tất cả dialog xác nhận hành động (xoá, lưu, áp dụng)  
> ❌ **Không dùng `<Popconfirm>` với `okButtonProps={{ style: { display: 'none' } }}`** — đây là anti-pattern

```tsx
<ModalCustomComponent
  isOpen={isConfirmOpen}
  header={t('POPUP_DIALOG.TITLE.CONFIRM')}
  content={<p>{t('POPUP_DIALOG.CONTENT.CONFIRM_MESSAGE')}</p>}
  fnHandleOk={handleConfirm}
  fnHandleCancel={() => setIsConfirmOpen(false)}
  okText={t('IDS_DELETE') as string}
  cancelText={t('IDS_BUTTON_CANCEL') as string}
  loading={isLoading}
/>
```

`ModalCustomComponent` tự áp dụng (không cần truyền thêm):

| Prop nội bộ     | Giá trị                               |
|-----------------|--------------------------------------|
| `style`         | `{ top: 20 }`                        |
| `title`         | `<Typography.Title level={4}>`       |
| `destroyOnClose`| `true`                               |
| `maskClosable`  | `false`                              |
| Footer OK       | `<Button type="primary" loading>`    |
| Footer Cancel   | `<Button className="cancel_button">` |
| Footer layout   | `<Space size="middle" align="start" style={{ width: '100%' }}>` |

---

## 13. Popup Confirm — Modal.confirm (phức tạp)

> Dùng khi cần warning context, async flow, hoặc cần huỷ bỏ programmatically

```tsx
let instance: ReturnType<typeof Modal.confirm>;
instance = Modal.confirm({
  title: t('POPUP_DIALOG.TITLE.CONFIRM'),
  icon: null,
  type: 'warning',
  content: t('IDS_WARNING_CONTENT'),
  footer: (
    <Space size="middle" align="start" style={{ width: '100%', marginTop: 16 }}>
      <Button
        type="primary"
        onClick={async () => {
          instance?.destroy();
          await handleConfirm();
        }}
      >
        {t('IDS_BUTTON_SAVE')}
      </Button>
      <Button onClick={() => instance?.destroy()}>
        {t('IDS_BUTTON_CANCEL')}
      </Button>
    </Space>
  ),
});
```

| Prop     | Giá trị     |
|----------|------------|
| `icon`   | `null`     |
| `type`   | `'warning'`|
| `footer` | Custom `<Space>` — không dùng `okButtonProps`/`cancelButtonProps` |

---

## 14. Page Layout

### 14.1 Wrapper Page
```tsx
// ✅ ĐÚNG
<div>
  ...
</div>

// ❌ SAI — không inline style trên wrapper
<div style={{ padding: '0', minHeight: '100vh' }}>
```

- Padding trang: do class `.content` trong `index.css` (`padding: 20px`) xử lý
- `minHeight: 100vh`: không cần — layout tự fill

### 14.2 Header Page (Title + Action)
```tsx
<div style={{
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: 16,       {/* ✅ bội số 4 */}
}}>
  <Typography.Title level={3}>{t('PAGE_TITLE')}</Typography.Title>
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>  {/* ✅ gap 12 */}
    {/* Search input / action buttons */}
  </div>
</div>
```

---

## CHECKLIST — Kiểm tra nhanh khi code màn hình mới

### Page
- [ ] Wrapper `<div>` không có inline style
- [ ] Title dùng `<Typography.Title level={3}>` không override style
- [ ] Action buttons dùng `<Button type="primary" size="middle">` (KHÔNG dùng `className="main_button"` hoặc `<MainButton>`)

### Form — Search/Filter
- [ ] `layout="horizontal"`, `labelCol={{ span: 1 }}`, `labelAlign="left"`
- [ ] `colon={false}` tại `<Form>`
- [ ] Label là `t('...')` thuần — không wrap span
- [ ] Không dùng local const `LABEL_STYLE`
- [ ] Không dùng `<Row gutter>` trong search form — dùng Ant Design horizontal layout
- [ ] Nested fields → `<Space direction="horizontal" size="small">`
- [ ] Không thêm `style={{ fontSize: 14 }}` trên Input/Select

### Form — Modal
- [ ] `layout="vertical"`
- [ ] `<Row gutter={[15, 15]}>` khi cần multi-column

### Button
- [ ] Mọi button đều có `size="middle"` (không bỏ trống hay dùng size="small")
- [ ] Primary: `<Button type="primary" size="middle">` — KHÔNG dùng `className="main_button"` hoặc `<MainButton>`
- [ ] Cancel/Clear: `<CancelButton size="middle">`
- [ ] Delete: `<Button danger size="middle">`
- [ ] Input search/filter: `size="small"` để đồng nhất với Select/Cascader

### Table
- [ ] Column title: plain `t('...')` — không wrap `<span>`
- [ ] Cell render: `<div>` thuần — không dùng `CELL_STYLE` local const
- [ ] `locale={{ emptyText: t('MESSAGE.COMMON.IDM_EMPTY_DATA') }}`
- [ ] `size="small"`, `bordered`, `pagination={false}`
- [ ] Space action icons: `<Space size="middle">`
- [ ] Space nội dung dọc: `<Space direction="vertical" size={4}>`
- [ ] Icon color: không hardcode `color: '#007240'`

### Modal Form
- [ ] `footer={null}`
- [ ] `destroyOnClose`
- [ ] `style={{ top: 20 }}`
- [ ] `width` explicit (600 / 800 / 1000)
- [ ] Title: `Typography.Title level={4} style={{ paddingBottom: 15, marginBottom: 0 }}` + icon `marginRight: '8px'`
- [ ] Footer buttons trong body: `<div style={{ marginTop: 15 }}><Space>`

### Modal Notify
- [ ] `maskClosable={false}`
- [ ] Title: plain string (không wrap Typography)
- [ ] Footer: `<Space><Button size="middle">...</Button></Space>` — căn **trái**

### Popup Confirm
- [ ] Dùng `<ModalCustomComponent>` thay vì `<Popconfirm>` ẩn button
- [ ] Với warning phức tạp: dùng `Modal.confirm({ icon: null, type: 'warning' })`

### Tooltip
- [ ] `color="#424242"`, `overlayInnerStyle={{ fontSize: '11px' }}`

### Spacing
- [ ] Search form: không dùng spacing arbitrary — Ant Design horizontal layout tự xử lý
- [ ] Modal footer: `marginTop: 15`
- [ ] Modal gutter: `[15, 15]`
- [ ] Page-level spacing: bội số 4 (4/8/12/16/20/24)

---

*Cập nhật lần cuối: 2026-06-28*  
*Áp dụng bắt đầu từ: user-list screen*
