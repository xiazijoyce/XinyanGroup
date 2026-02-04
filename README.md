# 美妆造ERP系统（前端）

## 本地运行步骤

1. 安装依赖（建议 Node.js 18+）：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

3. 打开浏览器访问：

```
http://localhost:5173
```

## 说明

- 使用 Vite + Vue 3 + Element Plus + Tailwind CSS + Lucide-Vue-Next 构建。
- 金额与数量计算使用 big.js 防止浮点误差。
- Excel/PDF 导出依赖 xlsx 与 jspdf-autotable，打印功能使用浏览器原生打印。
