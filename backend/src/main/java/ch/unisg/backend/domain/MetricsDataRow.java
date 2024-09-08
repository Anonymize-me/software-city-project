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
    private double cbo;
//    private double cboModified;
//    private double fanin;
//    private double fanout;
    private double wmc;
    private double dit;
    private double noc;
    private double rfc;
//    private double lcom;
    private double lcomStar;
//    private double tcc;
//    private double lcc;
    private double totalMethodsQty;
//    private double staticMethodsQty;
//    private double publicMethodsQty;
//    private double privateMethodsQty;
//    private double protectedMethodsQty;
//    private double defaultMethodsQty;
//    private double visibleMethodsQty;
//    private double abstractMethodsQty;
//    private double finalMethodsQty;
//    private double synchronizedMethodsQty;
    private double totalFieldsQty;
//    private double staticFieldsQty;
//    private double publicFieldsQty;
//    private double privateFieldsQty;
//    private double protectedFieldsQty;
//    private double defaultFieldsQty;
//    private double finalFieldsQty;
//    private double synchronizedFieldsQty;
//    private double nosi;
    private double loc;
//    private double returnQty;
    private double loopQty;
//    private double comparisonsQty;
    private double tryCatchQty;
//    private double parenthesizedExpsQty;
//    private double stringLiteralsQty;
//    private double numbersQty;
//    private double assignmentsQty;
    private double mathOperationsQty;
    private double variablesQty;
//    private double maxNestedBlocksQty;
//    private double anonymousClassesQty;
    private double innerClassesQty;
//    private double lambdasQty;
    private double uniqueWordsQty;
//    private String modifiers;
//    private double logStatementsQty;
}
