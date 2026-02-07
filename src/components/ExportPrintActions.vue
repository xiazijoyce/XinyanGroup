<template>
  <div class="flex gap-2">
    <el-button type="primary" @click="exportExcel">导出表格</el-button>
    <el-button type="warning" @click="exportPdf">导出文档</el-button>
    <el-button type="success" @click="printPage">打印</el-button>
  </div>
</template>

<script setup>
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  data: {
    type: Array,
    default: () => []
  },
  filename: {
    type: String,
    default: '导出文件'
  }
})

const exportExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(props.data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '数据')
  XLSX.writeFile(workbook, `${props.filename}.xlsx`)
}

const exportPdf = () => {
  const doc = new jsPDF('p', 'pt')
  const head = [props.columns.map((item) => item.label)]
  const body = props.data.map((row) => props.columns.map((item) => row[item.prop]))
  doc.text(props.filename, 40, 40)
  doc.autoTable({
    head,
    body,
    startY: 60,
    styles: { fontSize: 9 }
  })
  doc.save(`${props.filename}.pdf`)
}

const printPage = () => {
  window.print()
}
</script>
