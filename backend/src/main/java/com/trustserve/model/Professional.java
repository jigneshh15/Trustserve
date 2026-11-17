package com.trustserve.model;
/** Inheritance example: a professional is a specialised platform user. */
public class Professional extends PlatformUser {
    private String skill;
    private boolean idVerified;
    private boolean skillVerified;
    public Professional(String name,String email,String skill,boolean idVerified,boolean skillVerified) {
        super(name,email); this.skill=skill; this.idVerified=idVerified; this.skillVerified=skillVerified;
    }
    public String getSkill(){return skill;}
    public boolean isVerified(){return idVerified && skillVerified;}
}
