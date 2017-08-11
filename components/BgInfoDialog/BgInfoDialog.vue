<template>
  <el-dialog :visible="visible" @update:visible="updateVisible" @close="onClose" size="large">
    <span slot="title">Was sind unsere Bewertungs-Kriterien?</span>
    <p>Unsere Bewertungskriterien der Label lassen sich in die drei Kategorien Soziales, Ökologie sowie Glaubwürdigkeit einteilen. Da es sich bei den Labeln um unterschiedliche Systeme mit teilweise sehr verschiedenen Zielen handelt, ist eine einheitliche Analyse mit vergleichbaren Ergebnissen nicht immer einfach. Manche Nachhaltigkeitsinitiativen legen den Fokus beispielsweise nur auf bestimmte Stufen der Lieferkette (z. B. landwirtschaftliche Produktion), andere auf einzelne Produkte (z. B. Kaffee) oder Branchen (z. B. Textilien). Deswegen konnten wir nicht bei jedem Label alle Kriterien in jeder Stufe der Lieferkette gleichermaßen berücksichtigen.</p>

    <p>Im Zentrum unserer Untersuchung stand vielmehr das Ziel, Ihnen einen Überblick über den Zweck der jeweiligen Initiative zu geben und ihre wichtigsten Stärk</p>

    <p>Aus unseren Bewertungskriterien haben wir einen internen Fragenkatalog erstellt, anhand derer wir die verschiedenen Label bzw. Initiativen untersucht haben. Auf Basis von öffentlich zugänglichen Informationen wie Webseiten, den Richtlinien-Katalogen, Verhaltenskodizes und/oder Kontroll-Checklisten haben wir daraufhin Label-Profile erstellt, die wir den jeweiligen Initiativen zur Kommentierung vorgelegt haben. Sowohl deren Rückmeldung als auch die Einschätzung von Expert*innen im Themenfeld sind dann in die finale Bewertung im LABEL-CHECK eingegangen.</p>

    <p>Zur schnellen Beurteilung der Label haben wir eine Ampel eingeführt, welche unsere jeweils durchschnittliche Bewertung in den Kategorien Soziales, Ökologie und Glaubwürdigkeit anzeigt – für jede Kategorie von rot = „schlecht“ bis grün = „gut“ (inklusive Mischbewertungen, z. B. rot-gelb). Trifft ein Label zu einer Kategorie keine Aussage, ist der Kreis leer (grau). Jene Label, die in einer Kate­gorie am besten abschneiden, sind in der (grünen) Ampel zusätzlich mit der Auszeichnung VORBILD markiert. Diese vereinfachte Darstellung ermöglicht einen schnellen Blick auf die Schwerpunkte der jeweiligen Initiative und trifft eine Aussage darüber, wie anspruchsvoll das Label im Sinne unserer Kriterien ist. Eine „grüne“ Bewertung ist jedoch kein Freibrief, denn auch wenn das Label anspruchsvolle Standards vorsieht, können Probleme in der Lieferkette auftreten.
    Eine schlechte Bewertung kann auch daran liegen, dass der Fokus des Labels auf Kriterien liegt, die nicht Teil unserer Untersuchung waren (z. B. im Bereich artgerechte Tierhaltung).</p>

    <h2>Überblick Kriterien</h2>

    <h3>Soziales</h3>
    <ul>
      <li>Berücksichtigt die Initiative die ILO-Kern­arbeitsnormen?</li>
      <li>Fördert der Standard die Zahlung von existenzsichernden Löhnen?</li>
      <li>Wird das Recht auf Vereinigungsfreiheit und Kollektivverhandlungen gefördert?</li>
      <li>Beinhaltet der Standard Kriterien für einen unabhängigen Beschwerdemechanismus für Arbeitnehmer*innen?</li>
      <li>Gibt es Kriterien zu fairen Geschäfts- und Beschaffungspraktiken (Preisprämien, Schulungen, Reduktion des Zeitdrucks für Lieferanten etc.)?</li>
      <li>Gibt es ein System, welches die menschenrechtlichen Sorgfaltspflichten (due dilligence) entlang der Lieferkette prüft?</li>
    </ul>

    <h3>Umwelt</h3>
    <ul>
      <li>Gibt es ein Verbot von gefährlichen Chemikalien, z. B. in Anlehnung an internationalen Konventionen wie die REACH-Verordnung oder das Rotterdammer Abkommen?</li>
      <li>Sieht die Initiative Kriterien zum integrierten Pflanzenschutz und zur Fruchtfolge vor?</li>
      <li>Dürfen gentechnisch veränderte Organismen (GVO) in der Produktion verwendet werden?</li>
      <li>Werden bei der Erweiterung der Betriebsfläche Umweltauswirkungsstudien erstellt?</li>
      <li>Gibt es Kriterien zum Energie- und Wasserverbrauch sowie zur Produktion von Abwasser?</li>
      <li>Wird die Emission von Treibhausgasen gemessen und schrittweise reduziert?</li>
    </ul>

    <h3>Glaubwürdigkeit</h3>
    <ul>
      <li>Ist die Organisations- und Finanzierungsstruktur der Initiative öffentlich zugänglich?</li>
      <li>Gibt es eine ausgewogene Einbeziehung von Interessengruppen in Entscheidungsgremien?</li>
      <li>Wie oft und durch wen findet eine Überprüfung der Kriterien statt?</li>
      <li>Werden bei Kontrollen auch externe Interessengruppen einbezogen?</li>
      <li>Finden Risikoanalysen im Vorfeld statt?</li>
      <li>Werden die Ergebnisse veröffentlicht (Transparenz)?</li>
      <li>Liegt ein System vor, mit dem die Wirksamkeit anhand eigens festgelegter Nachhaltigkeitsziele überprüft wird?</li>
      <li>Besteht Klarheit darüber, was das Label aussagt?</li>
      <li>Gibt es Mindestanteile von zertifizierten Inhalten im Endprodukt?</li>
      <li>Ist die Herkunft des Endprodukts entlang der gesamten Lieferkette nachvollziehbar?</li>
    </ul>
    <span slot="footer">
      <el-button @click="dismiss">Close</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {moDialogVisibility} from '../DialogVisibility/DialogVisibility.js'

export default {
  mixins: [moDialogVisibility],
  props: ['visible'],
  methods: {
    onClose: function() {
      this.dismiss()
    }
  }
}
</script>

<style>
  p { margin-bottom: 10px; }

  h2, h3, ul {
    margin-bottom: 10px;
  }
</style>
