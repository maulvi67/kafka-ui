package com.provectus.kafka.ui.pages;

import com.codeborne.selenide.Condition;
import com.codeborne.selenide.SelenideElement;
import io.qameta.allure.Step;

import java.time.Duration;

import static com.codeborne.selenide.Selenide.$x;
import static com.provectus.kafka.ui.settings.Source.CLUSTER_NAME;

public class NaviSideBar {

    protected SelenideElement loadingSpinner = $x("//*[contains(text(),'Loading')]");
    protected SelenideElement dashboardMenuItem = $x("//a[@title='Dashboard']");
    protected String sideMenuOptionElementLocator = ".//ul/li[contains(.,'%s')]";
    protected String clusterElementLocator = "//aside/ul/li[contains(.,'%s')]";

    @Step
    public NaviSideBar waitUntilScreenReady() {
        loadingSpinner.shouldBe(Condition.disappear, Duration.ofSeconds(30));
        dashboardMenuItem.shouldBe(Condition.visible, Duration.ofSeconds(30));
        return this;
    }

    @Step
    public NaviSideBar openSideMenu(String clusterName, SideMenuOption option) {
        SelenideElement clusterElement = $x(String.format(clusterElementLocator, clusterName)).shouldBe(Condition.visible);
        if (clusterElement.parent().$$x(".//ul").size() == 0) {
            clusterElement.click();
        }
        clusterElement
                .parent()
                .$x(String.format(sideMenuOptionElementLocator, option.value))
                .click();
        return this;
    }

    @Step
    public NaviSideBar openSideMenu(SideMenuOption option) {
        openSideMenu(CLUSTER_NAME, option);
        return this;
    }

    public enum SideMenuOption {
        BROKERS("Brokers"),
        TOPICS("Topics"),
        CONSUMERS("Consumers"),
        SCHEMA_REGISTRY("Schema Registry"),
        KAFKA_CONNECT("Kafka Connect"),
        KSQL_DB("KSQL DB");

        final String value;

        SideMenuOption(String value) {
            this.value = value;
        }
    }
}