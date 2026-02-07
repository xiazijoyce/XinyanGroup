export const brandOptions = [
  '澄光',
  '初色',
  '植本',
  '悦颜',
  '丝柔',
  '琉光',
  '绮妍',
  '素颜',
  '晨光',
  '清肌'
]

export const brandTags = brandOptions.map((brand, index) => ({
  id: `BR-${String(index + 1).padStart(3, '0')}`,
  name: brand,
  owner: index % 2 === 0 ? '品牌部' : '市场部',
  status: index === 4 ? '停用' : '启用',
  remark: index === 4 ? '阶段性停用' : '合作中'
}))
