const labels = [
  {name: 'RSPO', img: 'logos/RSPO.png'},
  {name: 'EU Organic', img: 'logos/EU.jpg'},
  {name: 'Fairtrade', img: 'logos/Fairtrade.png'},
  {name: 'UTZ', img: 'logos/UTZ.png'}
]

const rndLabel = () => labels[Math.floor(Math.random() * labels.length)]
const rndRating = () => Math.ceil(Math.random() * 3)

export const genTableData = num => {
  const res = []
  for(let i = 0; i < num; i++) {
    res.push({
      label: rndLabel(),
      govTrans: rndRating(),
      envImpact: rndRating(),
      scoImpact: rndRating()
    })
  }
  return res
}
