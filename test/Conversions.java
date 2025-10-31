import org.junit.jupiter.api.*;

/**
 * JUnit test class for conversion functions
 * Tests: weight conversions (kg↔lb) and volume conversions (ml↔oz)
 */
public class Conversions {
    
    // Conversion constants
    private static final double KG_TO_LB = 2.20462;
    private static final double ML_TO_OZ = 0.033814;
    private static final double OZ_TO_ML = 29.5735;
    
    /**
     * Convert weight from kilograms to pounds
     */
    public static double convertKgToLb(double kg) {
        return kg * KG_TO_LB;
    }
    
    /**
     * Convert weight from pounds to kilograms
     */
    public static double convertLbToKg(double lb) {
        return lb / KG_TO_LB;
    }
    
    /**
     * Convert volume from milliliters to ounces
     */
    public static double convertMlToOz(double ml) {
        return ml * ML_TO_OZ;
    }
    
    /**
     * Convert volume from ounces to milliliters
     */
    public static double convertOzToMl(double oz) {
        return oz * OZ_TO_ML;
    }
    
    @Test
    public void testConvertKgToLb() {
        // Test SCRIPT-004: 70 kg should equal ~154.324 lb
        double result = convertKgToLb(70);
        Assertions.assertTrue(result >= 154.0 && result <= 154.5, 
            "Expected ~154.324 lb, got: " + result);
    }
    
    @Test
    public void testConvertLbToKg() {
        // Test SCRIPT-004: 154.324 lb should equal ~70 kg
        double result = convertLbToKg(154.324);
        Assertions.assertTrue(result >= 69.9 && result <= 70.1, 
            "Expected ~70.0 kg, got: " + result);
    }
    
    @Test
    public void testConvertMlToOz() {
        // Test SCRIPT-001: 3450 ml should equal ~116.66 oz
        double result = convertMlToOz(3450);
        Assertions.assertTrue(result >= 116.5 && result <= 116.7, 
            "Expected ~116.66 oz, got: " + result);
    }
    
    @Test
    public void testConvertOzToMl() {
        // Reverse conversion: 116.66 oz should equal ~3450 ml
        double result = convertOzToMl(116.66);
        Assertions.assertTrue(result >= 3440 && result <= 3460, 
            "Expected ~3450 ml, got: " + result);
    }
}

