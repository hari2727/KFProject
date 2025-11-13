package com.kfarchitect.manager;

import java.io.IOException;

import helpers.pageobjects.KFHomepage;
import helpers.pageobjects.KFLandingPage;
import helpers.pageobjects.KFLoginPage;
import helpers.pageobjects.KFProfileManagerPage;

public class PageObjectManager {

	public KFLoginPage loginPage;
	public KFLandingPage landingPage;
	public KFHomepage homepage;
	public KFProfileManagerPage profileManagerPage;
	public KFLoginPage getLoginPage() throws IOException {
		loginPage = new KFLoginPage();
		return loginPage;
	}
	
	public  KFLandingPage getLandingPage() throws IOException {
		landingPage = new KFLandingPage();
		return landingPage;
	}

	public  KFHomepage getHomepage() throws IOException {
		homepage = new KFHomepage();
		return homepage;
	}
	
	public  KFProfileManagerPage getProfileManagerPage() throws IOException {
		profileManagerPage = new KFProfileManagerPage();
		return profileManagerPage;
	}
}
