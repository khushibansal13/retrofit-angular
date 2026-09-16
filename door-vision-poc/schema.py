from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class DoorStandard(str, Enum):
    EURO_PROFILE = "euro_profile"
    PASSAGE_LATCH_EURO = "passage_latch_euro"
    CYLINDRICAL_KNOB_OR_LEVER = "cylindrical_knob_or_lever"
    US_DEADBOLT = "US_deadbolt"
    US_INTERCONNECTED = "US_interconnected"
    ANSI = "ANSI"
    TRADITIONAL_LEVER = "traditional_lever"
    UNKNOWN = "unknown"


class Handing(str, Enum):
    LEFT_HAND = "left_hand"
    RIGHT_HAND = "right_hand"
    UNKNOWN = "unknown"


class ThicknessClass(str, Enum):
    THIN_UNDER_35MM = "under_35mm"
    STANDARD_35_55MM = "35_to_55mm"
    THICK_55_85MM = "55_to_85mm"
    OVER_85MM = "over_85mm"
    UNKNOWN = "unknown"


class StileWidthClass(str, Enum):
    NARROW_UNDER_60MM = "narrow_stile"
    WIDE_OVER_60MM = "standard_stile"
    UNKNOWN = "unknown"


class LockType(str, Enum):
    EURO_CYLINDER = "euro_profile_cylinder"
    NO_LOCK_PASSAGE = "no_lock_passage"
    MECHANICAL_DEADBOLT = "mechanical_deadbolt"
    INTERCONNECTED_DEADBOLT = "interconnected_deadbolt"
    MORTISE = "mortise"
    TUBULAR_LATCH = "tubular_latch"
    MORTISE_KEYHOLE = "mortise_keyhole"
    UNKNOWN = "unknown"


class ComponentObs(BaseModel):
    detected: bool
    confidence: float = Field(..., ge=0.0, le=1.0)
    visual_evidence: str


class LockObs(ComponentObs):
    lock_type: LockType
    cylinder_visible: bool
    deadbolt_present: bool


class DoorProfile(BaseModel):
    door_material: str
    material_confidence: float

    door_style: str

    door_standard: DoorStandard
    door_standard_confidence: float

    handing: Handing
    handing_confidence: float

    approx_thickness_class: ThicknessClass
    stile_width_class: StileWidthClass

    lock: LockObs
    frame: ComponentObs
    handle: ComponentObs

    measured_thickness_mm: Optional[float] = None
    measured_backset_mm: Optional[float] = None
    measured_center_to_center_mm: Optional[float] = None


class ManualDoorRecommendationRequest(BaseModel):
    door_material: str
    door_thickness_mm: float
    door_type: str = "Interior"
    existing_lock: str = "Mortise"
    frame_type: str = "Timber"
