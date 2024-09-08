package ch.unisg.metricscomputationservice.domain.model;

import lombok.Data;

import java.util.Arrays;
import java.util.List;

@Data
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

    public MetricsDataRow(String file, String timestamp, List<MetricsDataRow> metricsDataRows) {
        this.timestamp = timestamp;
        this.commitNumber = metricsDataRows.get(0).getCommitNumber();
        this.commitHash = metricsDataRows.get(0).getCommitHash();
        this.file = file;

        this.cbo = metricsDataRows.stream().mapToDouble(MetricsDataRow::getCbo).average().orElse(0);
        this.wmc = metricsDataRows.stream().mapToDouble(MetricsDataRow::getWmc).average().orElse(0);
        this.dit = metricsDataRows.stream().mapToDouble(MetricsDataRow::getDit).average().orElse(0);
        this.noc = metricsDataRows.stream().mapToDouble(MetricsDataRow::getNoc).average().orElse(0);
        this.rfc = metricsDataRows.stream().mapToDouble(MetricsDataRow::getRfc).average().orElse(0);
        this.lcomStar = metricsDataRows.stream().mapToDouble(MetricsDataRow::getLcomStar).average().orElse(0);
        this.totalMethodsQty = metricsDataRows.stream().mapToDouble(MetricsDataRow::getTotalMethodsQty).sum();
        this.totalFieldsQty = metricsDataRows.stream().mapToDouble(MetricsDataRow::getTotalFieldsQty).sum();
        this.loc = metricsDataRows.stream().mapToDouble(MetricsDataRow::getLoc).sum();
        this.loopQty = metricsDataRows.stream().mapToDouble(MetricsDataRow::getLoopQty).sum();
        this.tryCatchQty = metricsDataRows.stream().mapToDouble(MetricsDataRow::getTryCatchQty).sum();
        this.mathOperationsQty = metricsDataRows.stream().mapToDouble(MetricsDataRow::getMathOperationsQty).sum();
        this.variablesQty = metricsDataRows.stream().mapToDouble(MetricsDataRow::getVariablesQty).sum();
        this.innerClassesQty = metricsDataRows.stream().mapToDouble(MetricsDataRow::getInnerClassesQty).sum();
        this.uniqueWordsQty = metricsDataRows.stream().mapToDouble(MetricsDataRow::getUniqueWordsQty).sum();
    }

    public MetricsDataRow(String[] fields) {
        for (int i = 0; i < fields.length; i++) {
            if (fields[i].equals("NaN") || fields[i] == null || fields[i].isEmpty()) {
                fields[i] = "0";
            }
        }

        this.file = fields[0];
//        this.className = fields[1];
//        this.type = fields[2];
        this.cbo = Double.parseDouble(fields[3]);
//        this.cboModified = Double.parseDouble(fields[4]);
//        this.fanin = Double.parseDouble(fields[5]);
//        this.fanout = Double.parseDouble(fields[6]);
        this.wmc = Double.parseDouble(fields[7]);
        this.dit = Double.parseDouble(fields[8]);
        this.noc = Double.parseDouble(fields[9]);
        this.rfc = Double.parseDouble(fields[10]);
//        this.lcom = Double.parseDouble(fields[11]);
        this.lcomStar = Double.parseDouble(fields[12]);
//        this.tcc = Double.parseDouble(fields[13]);
//        this.lcc = Double.parseDouble(fields[14]);
        this.totalMethodsQty = Double.parseDouble(fields[15]);
//        this.staticMethodsQty = Double.parseDouble(fields[16]);
//        this.publicMethodsQty = Double.parseDouble(fields[17]);
//        this.privateMethodsQty = Double.parseDouble(fields[18]);
//        this.protectedMethodsQty = Double.parseDouble(fields[19]);
//        this.defaultMethodsQty = Double.parseDouble(fields[20]);
//        this.visibleMethodsQty = Double.parseDouble(fields[21]);
//        this.abstractMethodsQty = Double.parseDouble(fields[22]);
//        this.finalMethodsQty = Double.parseDouble(fields[23]);
//        this.synchronizedMethodsQty = Double.parseDouble(fields[24]);
        this.totalFieldsQty = Double.parseDouble(fields[25]);
//        this.staticFieldsQty = Double.parseDouble(fields[26]);
//        this.publicFieldsQty = Double.parseDouble(fields[27]);
//        this.privateFieldsQty = Double.parseDouble(fields[28]);
//        this.protectedFieldsQty = Double.parseDouble(fields[29]);
//        this.defaultFieldsQty = Double.parseDouble(fields[30]);
//        this.finalFieldsQty = Double.parseDouble(fields[31]);
//        this.synchronizedFieldsQty = Double.parseDouble(fields[32]);
//        this.nosi = Double.parseDouble(fields[33]);
        this.loc = Double.parseDouble(fields[34]);
//        this.returnQty = Double.parseDouble(fields[35]);
        this.loopQty = Double.parseDouble(fields[36]);
//        this.comparisonsQty = Double.parseDouble(fields[37]);
        this.tryCatchQty = Double.parseDouble(fields[38]);
//        this.parenthesizedExpsQty = Double.parseDouble(fields[39]);
//        this.stringLiteralsQty = Double.parseDouble(fields[40]);
//        this.numbersQty = Double.parseDouble(fields[41]);
//        this.assignmentsQty = Double.parseDouble(fields[42]);
        this.mathOperationsQty = Double.parseDouble(fields[43]);
        this.variablesQty = Double.parseDouble(fields[44]);
//        this.maxNestedBlocksQty = Double.parseDouble(fields[45]);
//        this.anonymousClassesQty = Double.parseDouble(fields[46]);
        this.innerClassesQty = Double.parseDouble(fields[47]);
//        this.lambdasQty = Double.parseDouble(fields[48]);
        this.uniqueWordsQty = Double.parseDouble(fields[49]);
//        this.modifiers = fields[50];
//        this.logStatementsQty = Double.parseDouble(fields[51]);
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public void setCommitNumber(int commitNumber) {
        this.commitNumber = commitNumber;
    }

    public void setCommitHash(String commitHash) {
        this.commitHash = commitHash;
    }
}
