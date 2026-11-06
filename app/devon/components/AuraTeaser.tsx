import styles from "../opus.module.css";

/** Editorial placeholder preview until the separately developed AURA site is published. */
export default function AuraTeaser() {
  return (
    <div className={styles.auraShowcase} role="img" aria-label="AURA ONE luxury wireless headphones concept preview">
      <span className={styles.auraWordmark}>AURA</span>
      <svg className={styles.auraProduct} viewBox="0 0 600 440" aria-hidden="true">
        <defs>
          <linearGradient id="aura-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#eef1ef" />
            <stop offset="24%" stopColor="#99acb2" />
            <stop offset="48%" stopColor="#26333b" />
            <stop offset="77%" stopColor="#a8b8bc" />
            <stop offset="100%" stopColor="#3b4c54" />
          </linearGradient>
          <linearGradient id="aura-cup" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#bfcdd0" />
            <stop offset="27%" stopColor="#42545b" />
            <stop offset="65%" stopColor="#0e1920" />
            <stop offset="100%" stopColor="#8e9ca2" />
          </linearGradient>
          <radialGradient id="aura-pad">
            <stop offset="0%" stopColor="#20262b" />
            <stop offset="53%" stopColor="#111a20" />
            <stop offset="100%" stopColor="#020508" />
          </radialGradient>
        </defs>
        <path d="M140 260 C116 56 480 36 464 260" fill="none" stroke="#030609" strokeWidth="67" strokeLinecap="round" />
        <path d="M140 260 C116 56 480 36 464 260" fill="none" stroke="url(#aura-metal)" strokeWidth="49" strokeLinecap="round" />
        <path d="M152 145 C192 53 393 55 447 150" fill="none" stroke="#d6dfe1" strokeOpacity=".52" strokeWidth="5" strokeLinecap="round" />
        <path d="M142 240 L139 308 M465 240 L473 310" stroke="#6c8389" strokeWidth="24" strokeLinecap="round" />
        <g transform="rotate(-9 174 315)">
          <rect x="90" y="250" width="156" height="160" rx="63" fill="#05090c"/>
          <rect x="102" y="252" width="140" height="155" rx="59" fill="url(#aura-cup)" stroke="#c1cfd1" strokeOpacity=".36" strokeWidth="3"/>
          <ellipse cx="172" cy="328" rx="47" ry="68" fill="url(#aura-pad)" stroke="#566066" strokeWidth="14"/>
          <ellipse cx="172" cy="328" rx="25" ry="47" fill="#070b0d"/>
        </g>
        <g transform="rotate(10 429 315)">
          <rect x="342" y="251" width="165" height="160" rx="64" fill="#05090c"/>
          <rect x="351" y="253" width="147" height="157" rx="60" fill="url(#aura-cup)" stroke="#d8e2e3" strokeOpacity=".42" strokeWidth="3"/>
          <ellipse cx="425" cy="328" rx="55" ry="69" fill="url(#aura-pad)" stroke="#59686e" strokeWidth="13"/>
          <ellipse cx="425" cy="328" rx="32" ry="45" fill="#070b0f"/>
        </g>
      </svg>
      <span className={styles.auraCaption}>AURA ONE / INTERACTIVE PRODUCT STORY</span>
    </div>
  );
}
