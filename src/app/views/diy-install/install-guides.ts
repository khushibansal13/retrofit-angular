import { DoorConfig } from "../../app";

export interface InstallStep {
  title: string;
  description: string;
  icon: string;           // fallback if no imageUrl (or shown as a small badge over the image)
  imageUrl?: string;       // real diagram from the manufacturer install guide
  warning?: string;
  /** Only show this step for configs where this returns true. Omit to always show. */
  when?: (config: DoorConfig) => boolean;
}

export interface InstallGuide {
  productId: string;
  /** Provenance — which manufacturer document this was digitized from, and when. */
  source: string;
  steps: InstallStep[];
}

const ASSET_BASE = 'assets/install-guides/xs4-original-plus';

// Digitized from SALTO's official install guide for this exact lock family
// (doc ref 226844-ED.3-24/02/2025, "XS4 Original+ for USA mortise locks,
// cylindrical & tubular latches"). Steps and warnings below are transcribed
// from that PDF, not generic text — e.g. step 8's "DO NOT CLOSE THE DOOR"
// warning is a real, safety-relevant instruction from the manual that the
// old generic 5-step version had no equivalent of.
export const XS4_ORIGINAL_PLUS_GUIDE: InstallGuide = {
  productId: 'salto_xs4_original_plus_ansi',
  source: 'SALTO Installation Guide 226844-ED.3-24/02/2025',
  steps: [
    {
      title: 'Select handing',
      description:
        'Before mounting, set the lock handing to match your door swing. Remove the small handing screw shown in the callout and reposition it for left- or right-hand operation.',
      icon: 'swap_horiz',
      imageUrl: `${ASSET_BASE}/handing_1.jpg`,
    },
    {
      title: 'Connect the handing cable',
      description:
        'Reconnect the small ribbon cable inside the lock body after setting handing. This cable carries the handing signal to the electronics — do not disconnect it again after this step.',
      icon: 'cable',
      imageUrl: `${ASSET_BASE}/handing_2.jpg`,
      warning: 'Do not disconnect this cable once reconnected — Ne pas déconnecter — No desconectar.',
    },
    {
      title: 'Secure the mortise lock body',
      description:
        'Position the mortise lock in the door edge prep and secure it with the two long screws through the faceplate, top and bottom.',
      icon: 'construction',
      imageUrl: `${ASSET_BASE}/install_1.jpg`,
    },
    {
      title: 'Drill through-holes',
      description:
        'Drill the through-holes at 90° to the door face: Ø9/16" (14mm) for the mounting bolts. Thumb-turn models need an additional Ø5/8" (16mm) hole on the inside only.',
      icon: 'straighten',
      imageUrl: `${ASSET_BASE}/install_2.jpg`,
      warning: 'Minimum door thickness for this hole pattern is 1-1/2" (38mm).',
    },
    {
      title: 'Mount the outside escutcheon',
      description:
        'Fit the outside reader/handle assembly onto the mortise lock spindle and locking pin, then secure with the two supplied screws through the faceplate.',
      icon: 'lock',
      imageUrl: `${ASSET_BASE}/install_3.jpg`,
    },
    {
      title: 'Mount the electronics module',
      description:
        'Slide the inside electronics/PCB module onto the spindle, reconnect the ribbon cable to the outside reader, and secure the mounting screws from below.',
      icon: 'memory',
      imageUrl: `${ASSET_BASE}/install_4.jpg`,
    },
    {
      title: 'Attach the inside lever',
      description:
        'Fit the inside lever handle onto the through-spindle and press it home until it seats fully against the escutcheon.',
      icon: 'panorama_fish_eye',
      imageUrl: `${ASSET_BASE}/install_7.jpg`,
    },
    {
      title: 'Fit the inside cover',
      description:
        'Slide the inside cover down over the electronics module from the top, then secure it with the bottom screw.',
      icon: 'inventory_2',
      imageUrl: `${ASSET_BASE}/install_8.jpg`,
    },
    {
      title: 'Tighten the lever set screw',
      description:
        'Using the supplied hex key, tighten the set screw that locks the inside lever onto the spindle.',
      icon: 'build',
      imageUrl: `${ASSET_BASE}/install_9.jpg`,
    },
    {
      title: 'Program the lock before closing the door',
      description:
        'Stop here. Follow your SALTO user manual to program the lock and confirm it reads credentials correctly, then secure the final screw with the allen key.',
      icon: 'warning',
      imageUrl: `${ASSET_BASE}/install_10.jpg`,
      warning: 'AT THIS POINT DO NOT CLOSE THE DOOR. Program the lock first — if it is not programmed you may be locked out.',
    },
    {
      title: 'Battery notes',
      description:
        'This lock uses LR06 (AA) batteries. Replace all batteries together, not individually, and complete a battery change within 40 seconds to avoid losing lock memory.',
      icon: 'battery_alert',
      imageUrl: `${ASSET_BASE}/battery.jpg`,
      warning: 'Complete the battery swap within 40 seconds (MAX. 40") or the lock may lose its programming.',
    },
    {
      title: 'Connect and test',
      description:
        'Check lever movement, latch operation, and the electronic reader. Test the door several times with a valid credential before putting it into service.',
      icon: 'check_circle',
    },
  ],
};

const GUIDES_BY_PRODUCT_ID: Record<string, InstallGuide> = {
  [XS4_ORIGINAL_PLUS_GUIDE.productId]: XS4_ORIGINAL_PLUS_GUIDE,
};

export function getInstallGuide(productId: string | undefined | null): InstallGuide | null {
  if (!productId) return null;
  return GUIDES_BY_PRODUCT_ID[productId] ?? null;
}
