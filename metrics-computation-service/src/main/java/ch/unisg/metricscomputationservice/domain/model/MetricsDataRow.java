package ch.unisg.metricscomputationservice.domain.model;

import lombok.Data;

import java.util.Arrays;

@Data
public class MetricsDataRow {

    private String timestamp;
    private int commitNumber;

    private String file;
    private String className;
    private String type;
    private int cbo;
    private int cboModified;
    private int fanin;
    private int fanout;
    private int wmc;
    private int dit;
    private int noc;
    private int rfc;
    private int lcom;
    private double lcomStar;
    private double tcc;
    private double lcc;
//    private int totalMethodsQty;
//    private int staticMethodsQty;
//    private int publicMethodsQty;
//    private int privateMethodsQty;
//    private int protectedMethodsQty;
//    private int defaultMethodsQty;
//    private int visibleMethodsQty;
//    private int abstractMethodsQty;
//    private int finalMethodsQty;
//    private int synchronizedMethodsQty;
//    private int totalFieldsQty;
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
//    private int loopQty;
//    private int comparisonsQty;
//    private int tryCatchQty;
//    private int parenthesizedExpsQty;
//    private int stringLiteralsQty;
//    private int numbersQty;
//    private int assignmentsQty;
//    private int mathOperationsQty;
//    private int variablesQty;
//    private int maxNestedBlocksQty;
//    private int anonymousClassesQty;
//    private int innerClassesQty;
//    private int lambdasQty;
//    private int uniqueWordsQty;
//    private String modifiers;
//    private int logStatementsQty;

    public MetricsDataRow(String[] fields) {
        System.out.println(Arrays.toString(fields));

        for (int i = 0; i < fields.length; i++) {
            if (fields[i].equals("NaN") || fields[i] == null || fields[i].isEmpty()) {
                fields[i] = "0";
            }
        }

        this.file = fields[0];
        this.className = fields[1];
        this.type = fields[2];
        this.cbo = Integer.parseInt(fields[3]);
        this.cboModified = Integer.parseInt(fields[4]);
        this.fanin = Integer.parseInt(fields[5]);
        this.fanout = Integer.parseInt(fields[6]);
        this.wmc = Integer.parseInt(fields[7]);
        this.dit = Integer.parseInt(fields[8]);
        this.noc = Integer.parseInt(fields[9]);
        this.rfc = Integer.parseInt(fields[10]);
        this.lcom = Integer.parseInt(fields[11]);
        this.lcomStar = Double.parseDouble(fields[12]);
        this.tcc = Double.parseDouble(fields[13]);
        this.lcc = Double.parseDouble(fields[14]);
//        this.totalMethodsQty = Integer.parseInt(fields[15]);
//        this.staticMethodsQty = Integer.parseInt(fields[16]);
//        this.publicMethodsQty = Integer.parseInt(fields[17]);
//        this.privateMethodsQty = Integer.parseInt(fields[18]);
//        this.protectedMethodsQty = Integer.parseInt(fields[19]);
//        this.defaultMethodsQty = Integer.parseInt(fields[20]);
//        this.visibleMethodsQty = Integer.parseInt(fields[21]);
//        this.abstractMethodsQty = Integer.parseInt(fields[22]);
//        this.finalMethodsQty = Integer.parseInt(fields[23]);
//        this.synchronizedMethodsQty = Integer.parseInt(fields[24]);
//        this.totalFieldsQty = Integer.parseInt(fields[25]);
//        this.staticFieldsQty = Integer.parseInt(fields[26]);
//        this.publicFieldsQty = Integer.parseInt(fields[27]);
//        this.privateFieldsQty = Integer.parseInt(fields[28]);
//        this.protectedFieldsQty = Integer.parseInt(fields[29]);
//        this.defaultFieldsQty = Integer.parseInt(fields[30]);
//        this.finalFieldsQty = Integer.parseInt(fields[31]);
//        this.synchronizedFieldsQty = Integer.parseInt(fields[32]);
//        this.nosi = Integer.parseInt(fields[33]);
        this.loc = Integer.parseInt(fields[34]);
//        this.returnQty = Integer.parseInt(fields[35]);
//        this.loopQty = Integer.parseInt(fields[36]);
//        this.comparisonsQty = Integer.parseInt(fields[37]);
//        this.tryCatchQty = Integer.parseInt(fields[38]);
//        this.parenthesizedExpsQty = Integer.parseInt(fields[39]);
//        this.stringLiteralsQty = Integer.parseInt(fields[40]);
//        this.numbersQty = Integer.parseInt(fields[41]);
//        this.assignmentsQty = Integer.parseInt(fields[42]);
//        this.mathOperationsQty = Integer.parseInt(fields[43]);
//        this.variablesQty = Integer.parseInt(fields[44]);
//        this.maxNestedBlocksQty = Integer.parseInt(fields[45]);
//        this.anonymousClassesQty = Integer.parseInt(fields[46]);
//        this.innerClassesQty = Integer.parseInt(fields[47]);
//        this.lambdasQty = Integer.parseInt(fields[48]);
//        this.uniqueWordsQty = Integer.parseInt(fields[49]);
//        this.modifiers = fields[50];
//        this.logStatementsQty = Integer.parseInt(fields[51]);
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public void setCommitNumber(int commitNumber) {
        this.commitNumber = commitNumber;
    }
}
