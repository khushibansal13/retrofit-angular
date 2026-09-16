import json
from typing import List, Dict, Any

from schema import (
    DoorProfile,
    DoorStandard,
)


class SaltoCompatibilityEngine:

    def __init__(
        self,
        seed_file: str,
    ):
        with open(
            seed_file,
            "r",
            encoding="utf-8",
        ) as f:
            self.data = json.load(f)

        self.products = self.data.get(
            "products",
            [],
        )

    def evaluate(
        self,
        profile: DoorProfile,
    ) -> List[Dict[str, Any]]:

        results = []

        for product in self.products:

            product_id = product[
                "product_id"
            ]

            name = product[
                "name"
            ]

            status = "incompatible"

            reasons = []

            missing = []

            source_document = (
                product.get(
                    "source_documents",
                    ["Salto Technical Specs"],
                )[0]
            )

            # -----------------------------------------
            # SALTO DLok Euro
            # -----------------------------------------

            if product_id == "salto_dlok_euro":

                if (
                    profile.door_standard
                    == DoorStandard.EURO_PROFILE
                    and profile.lock.cylinder_visible
                ):
                    status = "compatible"

                    reasons.append(
                        "Euro profile cylinder detected. Direct cylinder retrofit supported."
                    )

                elif (
                    profile.door_standard
                    in [
                        DoorStandard.EURO_PROFILE,
                        DoorStandard.PASSAGE_LATCH_EURO,
                    ]
                    and not profile.lock.cylinder_visible
                ):
                    status = (
                        "missing_information"
                    )

                    missing.append(
                        "euro_cylinder_installation"
                    )

                    reasons.append(
                        "Passage latch detected (no cylinder found). Requires Euro-profile mortise cassette before installing DLok."
                    )

                elif (
                    profile.door_standard
                    == DoorStandard.CYLINDRICAL_KNOB_OR_LEVER
                ):
                    status = "incompatible"

                    reasons.append(
                        "Incompatible: Cylindrical knob lock detected. DLok Euro requires a DIN Euro profile mortise cylinder."
                    )

                else:
                    reasons.append(
                        "Requires Euro Profile Cylinder; detected "
                        f"{profile.door_standard.value}."
                    )

            # -----------------------------------------
            # SALTO XS4 Original+ EURO
            # -----------------------------------------

            elif (
                product_id
                == "salto_xs4_original_plus_euro"
            ):

                if (
                    profile.door_standard
                    in [
                        DoorStandard.EURO_PROFILE,
                        DoorStandard.PASSAGE_LATCH_EURO,
                    ]
                ):

                    if (
                        profile.measured_thickness_mm
                        is None
                    ):
                        status = (
                            "missing_information"
                        )

                        missing.append(
                            "door_thickness_mm"
                        )

                        reasons.append(
                            "Euro door profile confirmed. Confirm thickness to size spindle."
                        )

                    else:
                        status = "compatible"

                        reasons.append(
                            "Compatible with European DIN mortise."
                        )

                else:
                    reasons.append(
                        "Requires European profile door; detected "
                        f"{profile.door_standard.value}."
                    )

            # -----------------------------------------
            # SALTO DBolt Touch
            # -----------------------------------------

            elif (
                product_id
                == "salto_dbolt_touch"
            ):

                if (
                    profile.door_standard
                    == DoorStandard.US_DEADBOLT
                ):

                    if (
                        profile.measured_thickness_mm
                        is None
                    ):
                        status = (
                            "missing_information"
                        )

                        missing.append(
                            "door_thickness_mm"
                        )

                        reasons.append(
                            "US Deadbolt detected. Awaiting thickness confirmation."
                        )

                    elif (
                        35
                        <= profile.measured_thickness_mm
                        <= 85
                    ):
                        status = "compatible"

                        reasons.append(
                            f"Door thickness {profile.measured_thickness_mm}mm supported."
                        )

                    else:
                        status = "incompatible"

                        reasons.append(
                            "Door thickness out of supported range."
                        )

                else:
                    reasons.append(
                        "Requires US Deadbolt standard; detected "
                        f"{profile.door_standard.value}."
                    )

            # -----------------------------------------
            # SALTO DBolt Touch Interconnected
            # -----------------------------------------

            elif (
                product_id
                == "salto_dbolt_touch_ic"
            ):

                if (
                    profile.door_standard
                    == DoorStandard.US_INTERCONNECTED
                ):

                    if (
                        profile.measured_thickness_mm
                        is None
                    ):
                        status = (
                            "missing_information"
                        )

                        missing.append(
                            "door_thickness_mm"
                        )

                        reasons.append(
                            "Interconnected standard detected. Awaiting thickness confirmation."
                        )

                    elif (
                        40
                        <= profile.measured_thickness_mm
                        <= 85
                    ):
                        status = "compatible"

                        reasons.append(
                            f"Door thickness {profile.measured_thickness_mm}mm supported."
                        )

                    else:
                        status = "incompatible"

                        reasons.append(
                            "Door thickness out of supported range."
                        )

                else:
                    reasons.append(
                        "Requires US Interconnected standard; detected "
                        f"{profile.door_standard.value}."
                    )

            # -----------------------------------------
            # SALTO XS4 Original+ ANSI
            # -----------------------------------------

            elif (
                product_id
                == "salto_xs4_original_plus_ansi"
            ):

                if (
                    profile.door_standard
                    in [
                        DoorStandard.ANSI,
                        DoorStandard.CYLINDRICAL_KNOB_OR_LEVER,
                        DoorStandard.US_DEADBOLT,
                    ]
                ):

                    if (
                        profile.measured_thickness_mm
                        is None
                    ):
                        status = (
                            "missing_information"
                        )

                        missing.append(
                            "door_thickness_mm"
                        )

                        reasons.append(
                            "Cylindrical/ANSI preparation detected. Confirm door thickness."
                        )

                    else:
                        status = "compatible"

                        reasons.append(
                            "Compatible with ANSI/cylindrical door preparation."
                        )

                else:
                    reasons.append(
                        "Requires ANSI/Cylindrical door standard; detected "
                        f"{profile.door_standard.value}."
                    )

            results.append(
                {
                    "product_id":
                        product_id,

                    "name":
                        name,

                    "family":
                        product.get(
                            "family"
                        ),

                    "status":
                        status,

                    "reasons":
                        reasons,

                    "missing_inputs":
                        missing,

                    "source_document":
                        source_document,
                }
            )

        # Compatible first, then missing information,
        # then incompatible.
        order = {
            "compatible": 0,
            "missing_information": 1,
            "incompatible": 2,
        }

        results.sort(
            key=lambda result:
                order.get(
                    result["status"],
                    3,
                )
        )

        return results
