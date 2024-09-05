package ch.unisg.backend.domain;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MetricsDataRow {

    private String timestamp;
    private int commitNumber;
    private String commitHash;

    private String file;
//    private String className;
//    private String type;
    private int cbo;
//    private int cboModified;
//    private int fanin;
//    private int fanout;
    private int wmc;
    private int dit;
    private int noc;
    private int rfc;
//    private int lcom;
    private double lcomStar;
//    private double tcc;
//    private double lcc;
    private int totalMethodsQty;
//    private int staticMethodsQty;
//    private int publicMethodsQty;
//    private int privateMethodsQty;
//    private int protectedMethodsQty;
//    private int defaultMethodsQty;
//    private int visibleMethodsQty;
//    private int abstractMethodsQty;
//    private int finalMethodsQty;
//    private int synchronizedMethodsQty;
    private int totalFieldsQty;
//    private int staticFieldsQty;
//    private int publicFieldsQty;
//    private int privateFieldsQty;
//    private int protectedFieldsQty;
//    private int defaultFieldsQty;
//    private int finalFieldsQty;
//    private int synchronizedFieldsQty;
//    private int nosi;
    private int loc;
//    private int returnQty;
    private int loopQty;
//    private int comparisonsQty;
    private int tryCatchQty;
//    private int parenthesizedExpsQty;
//    private int stringLiteralsQty;
//    private int numbersQty;
//    private int assignmentsQty;
    private int mathOperationsQty;
    private int variablesQty;
//    private int maxNestedBlocksQty;
//    private int anonymousClassesQty;
    private int innerClassesQty;
//    private int lambdasQty;
    private int uniqueWordsQty;
//    private String modifiers;
//    private int logStatementsQty;
}
