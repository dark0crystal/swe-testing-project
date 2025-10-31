import org.junit.jupiter.api.*;
import java.util.HashMap;
import java.util.Map;

/**
 * JUnit test class for validation functions
 * Tests: weight validation, activity level validation, and weather condition validation
 */
public class Validations {
    
    // Conversion constant: 1 kg = 2.20462 lb
    private static final double KG_TO_LB = 2.20462;
    
    // Validation thresholds
    private static final double MIN_WEIGHT_KG = 20.0;
    private static final double MAX_WEIGHT_KG = 300.0;
    
    // Activity level multipliers (for validation)
    private static final Map<String, Double> ACTIVITY_MULTIPLIERS = new HashMap<>();
    static {
        ACTIVITY_MULTIPLIERS.put("sedentary", 1.0);
        ACTIVITY_MULTIPLIERS.put("light", 1.1);
        ACTIVITY_MULTIPLIERS.put("moderate", 1.2);
        ACTIVITY_MULTIPLIERS.put("active", 1.3);
        ACTIVITY_MULTIPLIERS.put("very_active", 1.4);
    }
    
    // Weather condition adjustments (for validation)
    private static final Map<String, Double> WEATHER_ADJUSTMENTS = new HashMap<>();
    static {
        WEATHER_ADJUSTMENTS.put("cool", 0.0);
        WEATHER_ADJUSTMENTS.put("cold", 0.0); // Alternative name
        WEATHER_ADJUSTMENTS.put("mild", 200.0);
        WEATHER_ADJUSTMENTS.put("warm", 400.0);
        WEATHER_ADJUSTMENTS.put("hot", 600.0);
    }
    
    /**
     * Convert pounds to kilograms (helper method)
     */
    private static double convertLbToKg(double lb) {
        return lb / KG_TO_LB;
    }
    
    /**
     * Validate weight input
     */
    public static boolean validateWeight(Double weight, String unit) {
        if (weight == null || weight <= 0) {
            return false;
        }
        
        double weightKg = unit.equalsIgnoreCase("lb") ? convertLbToKg(weight) : weight;
        
        if (weightKg < MIN_WEIGHT_KG || weightKg > MAX_WEIGHT_KG) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate activity level
     */
    public static boolean validateActivityLevel(String activityLevel) {
        return activityLevel != null && ACTIVITY_MULTIPLIERS.containsKey(activityLevel.toLowerCase());
    }
    
    /**
     * Validate weather condition
     */
    public static boolean validateWeatherCondition(String weatherCondition) {
        return weatherCondition != null && WEATHER_ADJUSTMENTS.containsKey(weatherCondition.toLowerCase());
    }
    
    @Test
    public void testValidateWeight() {
        // Test SCRIPT-002: Missing weight validation should return false
        Assertions.assertFalse(validateWeight(null, "kg"), "Null weight should be invalid");
        Assertions.assertFalse(validateWeight(0.0, "kg"), "Zero weight should be invalid");
        Assertions.assertFalse(validateWeight(19.9, "kg"), "Weight < 20kg should be invalid"); // SCRIPT-003
        
        // Valid weights
        Assertions.assertTrue(validateWeight(70.0, "kg"), "70 kg should be valid");
        Assertions.assertTrue(validateWeight(20.0, "kg"), "20 kg (minimum) should be valid");
        Assertions.assertTrue(validateWeight(300.0, "kg"), "300 kg (maximum) should be valid");
    }
    
    @Test
    public void testValidateActivityLevel() {
        // Test SCRIPT-001: Moderate should be valid
        Assertions.assertTrue(validateActivityLevel("moderate"), "moderate should be valid");
        Assertions.assertTrue(validateActivityLevel("Moderate"), "Case insensitive validation");
        
        // Valid activity levels
        Assertions.assertTrue(validateActivityLevel("sedentary"));
        Assertions.assertTrue(validateActivityLevel("light"));
        Assertions.assertTrue(validateActivityLevel("active"));
        Assertions.assertTrue(validateActivityLevel("very_active"));
        
        // Invalid activity levels
        Assertions.assertFalse(validateActivityLevel("invalid"), "Invalid activity level should return false");
        Assertions.assertFalse(validateActivityLevel(null), "Null activity level should return false");
    }
    
    @Test
    public void testValidateWeatherCondition() {
        // Test SCRIPT-001: Hot should be valid
        Assertions.assertTrue(validateWeatherCondition("hot"), "hot should be valid");
        Assertions.assertTrue(validateWeatherCondition("Hot"), "Case insensitive validation");
        
        // Valid weather conditions
        Assertions.assertTrue(validateWeatherCondition("cool"));
        Assertions.assertTrue(validateWeatherCondition("cold")); // Alternative name
        Assertions.assertTrue(validateWeatherCondition("mild"));
        Assertions.assertTrue(validateWeatherCondition("warm"));
        
        // Invalid weather conditions
        Assertions.assertFalse(validateWeatherCondition("invalid"), "Invalid weather condition should return false");
        Assertions.assertFalse(validateWeatherCondition(null), "Null weather condition should return false");
    }
}

