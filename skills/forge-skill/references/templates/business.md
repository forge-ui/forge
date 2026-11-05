# 业务模板 — templates/ecommerce

电商后台骨架，5 个模块，每模块三件套（列表 / 详情 / 新建）：

| 模块 | 路径 |
|---|---|
| categories | `src/app/templates/(dashboard)/ecommerce/categories/` |
| customers | `src/app/templates/(dashboard)/ecommerce/customers/` |
| orders | `src/app/templates/(dashboard)/ecommerce/orders/` |
| products | `src/app/templates/(dashboard)/ecommerce/products/` |
| sellers | `src/app/templates/(dashboard)/ecommerce/sellers/` |

每模块结构：

```
<module>/
├── page.tsx          # 列表
├── [id]/
│   └── page.tsx      # 详情
└── new/
    └── page.tsx      # 新建
```

## 新业务接入

1. 选最接近的模块 copy（如 orders 适合"订单类业务"）
2. 改路由目录名 + page 里的字段和接口
3. 保留 `<AppLayout>` + `<Toolbar>` + `<DataTable>` / 表单 骨架
4. 二开只改"数据"，不改"结构"
