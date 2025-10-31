# Water Daily Tracker - Calculation Functions

This document contains all the calculation functions needed to implement the water daily tracker tests.

## 1. Main Water Goal Calculation

### Function: `calculateDailyWaterGoal`

**Formula:**
```
Base Amount = weight (kg) × 35 ml/kg
Activity Adjusted = Base Amount × Activity Multiplier
Final Amount = Activity Adjusted + Weather Adjustment
Result = Round to nearest 50ml
```

**Parameters:**
- `weight` (double): Weight in kg
- `activityLevel` (String): One of: "sedentary", "light", "moderate", "active", "very_active"
- `weatherCondition` (String): One of: "cool", "mild", "warm", "hot"

**Activity Level Multipliers:**
- `sedentary`: 1.0
- `light`: 1.1
- `moderate`: 1.2
- `active`: 1.3
- `very_active`: 1.4

**Weather Adjustments (ml):**
- `cool`: 0
- `mild`: 200
- `warm`: 400
- `hot`: 600

**Rounding:**
- Round to nearest 50ml (Math.round(result / 50) * 50)

**Example (SCRIPT-001):**
```
Weight: 70 kg
Activity: moderate (1.2x)
Weather: hot (+600ml)

Calculation (Standard Formula):
  Base: 70 × 35 = 2450 ml
  Activity Adjusted: 2450 × 1.2 = 2940 ml
  Final: 2940 + 600 = 3540 ml
  Rounded: Round(3540/50) × 50 = Round(70.8) × 50 = 71 × 50 = 3550 ml

**IMPORTANT:** Test case expects 3450ml. Verify with actual app behavior:
  - If app returns 3450ml, there may be different calculation logic
  - Possible variations:
    1. Different rounding behavior (rounding at intermediate steps)
    2. Different formula order
    3. Test case may have typo or use different input values
  
  To verify: Run actual calculation in app and compare result.
```

**Calculation Verification for SCRIPT-001:**
- **Input:** Weight=70 kg, Activity=Moderate, Weather=Hot
- **Expected by test:** 3450 ml, 116.66 oz
- **Standard calculation result:** 3550 ml (verify with actual app)
- **Conversion check:** 3450 ml × 0.033814 = 116.6583 oz ≈ 116.66 oz ✓

---

## 2. Weight Conversion Functions

### Function: `convertKgToLb`
**Formula:** `weightInLb = weightInKg × 2.20462`

**Example:**
- 70 kg = 70 × 2.20462 = 154.3234 lb ≈ 154.324 lb

### Function: `convertLbToKg`
**Formula:** `weightInKg = weightInLb / 2.20462`

**Example:**
- 154.324 lb = 154.324 / 2.20462 = 70.0 kg (approximately)

**Conversion Constants:**
- 1 kg = 2.20462 lb
- 1 lb = 0.453592 kg

---

## 3. Volume Conversion Functions

### Function: `convertMlToOz`
**Formula:** `volumeInOz = volumeInMl × 0.033814`

**Example (SCRIPT-001):**
- 3450 ml = 3450 × 0.033814 = 116.6583 oz ≈ 116.66 oz

### Function: `convertOzToMl`
**Formula:** `volumeInMl = volumeInOz / 0.033814` or `volumeInMl = volumeInOz × 29.5735`

**Example:**
- 116.66 oz = 116.66 × 29.5735 = 3450.0 ml (approximately)

**Conversion Constants:**
- 1 ml = 0.033814 oz
- 1 oz = 29.5735 ml

---

## 4. Validation Functions

### Function: `validateWeight`
**Parameters:**
- `weight` (Double): Weight value (can be null)
- `unit` (String): "kg" or "lb"
- `minWeightKg` (double): Minimum weight in kg (default: 20.0)
- `maxWeightKg` (double): Maximum weight in kg (default: 300.0)

**Validation Rules:**
1. Weight cannot be null or empty
2. Weight must be > 0
3. If unit is "lb", convert to kg first for validation
4. Weight must be >= 20.0 kg (or throw warning for 19.9 kg)
5. Weight must be <= 300.0 kg

**Return:**
- `true` if valid
- `false` if invalid
- `null` or special flag if unusual (e.g., 19.9 kg - needs user confirmation)

### Function: `validateActivityLevel`
**Parameters:**
- `activityLevel` (String)

**Valid Values:**
- "sedentary"
- "light" 
- "moderate"
- "active"
- "very_active"

**Return:** `true` if valid, `false` otherwise

### Function: `validateWeatherCondition`
**Parameters:**
- `weatherCondition` (String)

**Valid Values:**
- "cool" (or "cold" - check if app uses "cold")
- "mild"
- "warm"
- "hot"

**Return:** `true` if valid, `false` otherwise

---

## 5. Complete Calculation Flow

### Step-by-step for SCRIPT-001:
1. **Input:** Weight=70 kg, Activity=Moderate, Weather=Hot
2. **Convert weight if needed:** Already in kg (70)
3. **Calculate base:** 70 × 35 = 2450 ml
4. **Apply activity multiplier:** 2450 × 1.2 = 2940 ml
5. **Add weather adjustment:** 2940 + 600 = 3540 ml
6. **Round to nearest 50:** Round(3540/50) × 50 = Round(70.8) × 50 = 71 × 50 = 3550 ml
   
   **OR if intermediate rounding:**
   - Round base: Round(2450/50) × 50 = 2450 (already multiple of 50)
   - Round activity: Round(2940/50) × 50 = 2950
   - Add weather: 2950 + 600 = 3550
   
   **OR if the implementation rounds differently, verify:**
   - Check if result should be 3450 ml exactly

7. **Convert to oz:** 3450 × 0.033814 = 116.6583 ≈ 116.66 oz

### For SCRIPT-004 (lb conversion):
1. **Input:** Weight=154.324 lb, Activity=Moderate, Weather=Hot
2. **Convert to kg:** 154.324 / 2.20462 = 70.0 kg
3. **Calculate as above:** Should result in ~3450 ml

---

## 6. Java Implementation Guide

### Core Calculation Method:
```java
public double calculateDailyWaterGoal(double weightKg, String activityLevel, String weatherCondition) {
    // Base calculation
    double baseAmount = weightKg * 35.0;
    
    // Activity multipliers
    Map<String, Double> activityMultipliers = Map.of(
        "sedentary", 1.0,
        "light", 1.1,
        "moderate", 1.2,
        "active", 1.3,
        "very_active", 1.4
    );
    
    // Weather adjustments
    Map<String, Double> weatherAdjustments = Map.of(
        "cool", 0.0,
        "mild", 200.0,
        "warm", 400.0,
        "hot", 600.0
    );
    
    // Calculate
    double activityAdjusted = baseAmount * activityMultipliers.get(activityLevel);
    double finalAmount = activityAdjusted + weatherAdjustments.get(weatherCondition);
    
    // Round to nearest 50ml
    return Math.round(finalAmount / 50.0) * 50.0;
}
```

### Conversion Methods:
```java
public double convertKgToLb(double kg) {
    return kg * 2.20462;
}

public double convertLbToKg(double lb) {
    return lb / 2.20462;
}

public double convertMlToOz(double ml) {
    return ml * 0.033814;
}

public double convertOzToMl(double oz) {
    return oz * 29.5735;
}
```

### Validation Method:
```java
public boolean validateWeight(Double weight, String unit, boolean allowUnusual) {
    if (weight == null || weight <= 0) {
        return false;
    }
    
    double weightKg = unit.equals("lb") ? convertLbToKg(weight) : weight;
    
    if (weightKg < 20.0) {
        return allowUnusual; // Requires user confirmation
    }
    
    if (weightKg > 300.0) {
        return false;
    }
    
    return true;
}
```

---

## 7. Test Case Expected Values

### SCRIPT-001:
- Input: 70 kg, Moderate, Hot
- Expected: 3450 ml, 116.66 oz
- **Note:** Verify exact calculation matches your implementation

### SCRIPT-003:
- Input: 19.9 kg, Low, Cold
- Expected: Warning message, requires confirmation
- Threshold: < 20.0 kg is unusual

### SCRIPT-004:
- Input: 154.324 lb, Moderate, Hot
- Expected: ~3450 ml (±1 ml), ~116.66 oz

---

## 8. Constants Summary

```java
// Weight conversion
private static final double KG_TO_LB = 2.20462;
private static final double LB_TO_KG = 0.453592;

// Volume conversion  
private static final double ML_TO_OZ = 0.033814;
private static final double OZ_TO_ML = 29.5735;

// Water calculation base
private static final double ML_PER_KG = 35.0;

// Rounding
private static final double ROUNDING_INTERVAL = 50.0;

// Validation thresholds
private static final double MIN_WEIGHT_KG = 20.0;
private static final double MAX_WEIGHT_KG = 300.0;
```

