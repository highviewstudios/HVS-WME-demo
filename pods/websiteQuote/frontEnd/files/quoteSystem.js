import React, { useState, useEffect } from "react";
import { Row, Col, Button, Dropdown, Table, Modal, Form } from "react-bootstrap";
import Axios from "axios";
import { isBrowser } from "react-device-detect";

//STYLES
import * as QuoteSystemStyles from "../styles/quoteSystem";
import * as UploadStyles from "../../../../../administration/pods/media/styles/upload"; //CROSS-OVER POD (from pod ref. A5)

function QuoteSystem() {
    const [tab, setTab] = useState("Hosting and Domain Names");
    const [hostingTypes, setHostingTypes] = useState({
        selected: "select",
        unitPrice: "",
        quantity: "",
        price: "",
        items: []
    });

    const [domainName, setDomainName] = useState({
        selected: "select",
        unitPrice: "",
        quantity: "",
        price: "",
        items: []
    });

    const [setupFees, setSetupFees] = useState({
        unitPrice: "",
        quantity: "",
        price: "",
        items: []
    });

    const [emailAccounts, setEmailAccounts] = useState({
        selected: "0",
        unitPrice: "",
        monthlyPrice: 0,
        quantity: "",
        price: "0",
        items: []
    });

    const [sslCertificate, setSslCerticate] = useState({
        selected: "select",
        unitPrice: "",
        quantity: "",
        price: "",
        items: []
    });

    const [location, setLocation] = useState({
        selected: "select",
        unitPrice: "",
        quantity: "",
        price: "",
        items: []
    });

    const [totals, setTotals] = useState({
        setupTotal: 0,
        yearlyTotal: 0
    });

    const [submitModal, setSubmitModal] = useState({
        open: false,
        name: "",
        email: "",
        additionalInfo: "",
        maxLength: 200,
        currentLeft: 200
    });

    function handleSubmitModalClose() {
        setSubmitModal((prevState) => {
            return { ...prevState, open: false };
        });
    }

    const [modal, setModal] = useState({
        header: "",
        open: false,
        message: "",
        error: false
    });

    function handleCloseModal() {
        setModal((prevState) => {
            return { ...prevState, open: false };
        });
    }

    useEffect(() => {
        onStart();
    }, []);

    function onStart() {
        Axios.post("/pods/websiteQuote/quoteSystem/getItems")
            .then((res) => {
                const data = res.data;

                if (data.error == "null") {
                    setHostingTypes((prevState) => {
                        return { ...prevState, items: data.hostingTypes };
                    });
                    setSetupFees((prevState) => {
                        return { ...prevState, items: data.setupFees };
                    });
                    setDomainName((prevState) => {
                        return { ...prevState, items: data.domainName };
                    });
                    const noOfAccounts = parseInt(data.emailAccounts.find((item) => item.item == "Accounts").data);
                    const accounts = [];
                    for (let i = 0; i <= noOfAccounts; i++) {
                        accounts.push(i);
                    }
                    const emailData = data.emailAccounts.find((item) => item.item == "Price Per");
                    setEmailAccounts((prevState) => {
                        return {
                            ...prevState,
                            items: accounts,
                            unitPrice: emailData.unitPrice,
                            quantity: emailData.quantity
                        };
                    });
                    setSslCerticate((prevState) => {
                        return { ...prevState, items: data.sslCertificate };
                    });
                    setLocation((prevState) => {
                        return { ...prevState, items: data.location };
                    });
                }
            })
            .catch((err) => console.log(err));
    }

    function hostingTypeSelectClick(item) {
        const quantity = parseFloat(item.quantity);

        const price = parseFloat(item.unitPrice) * quantity;

        setHostingTypes((prevState) => {
            return {
                ...prevState,
                selected: item.item,
                quantity: quantity.toString(),
                unitPrice: item.unitPrice,
                price: price.toFixed(2)
            };
        });

        const setupItem = setupFees.items.find((fee) => fee.item == item.item);

        const setupFeePrice = parseFloat(setupItem.unitPrice) * parseFloat(setupItem.quantity);

        setSetupFees((prevState) => {
            return { ...prevState, unitPrice: setupItem.unitPrice, quantity: setupItem.quantity, price: setupFeePrice.toFixed(2) };
        });

        workOutTotals(
            item.item,
            domainName.selected,
            sslCertificate.selected,
            location.selected,
            price.toFixed(2),
            setupFeePrice.toFixed(2),
            domainName.price,
            emailAccounts.price,
            sslCertificate.price,
            location.price
        );
    }

    function domainNameSelectClick(item) {
        const price = parseFloat(item.unitPrice) * parseFloat(item.quantity);

        setDomainName((prevState) => {
            return { ...prevState, selected: item.item, unitPrice: item.unitPrice, quantity: item.quantity, price: price.toFixed(2) };
        });

        workOutTotals(
            hostingTypes.selected,
            item.item,
            sslCertificate.selected,
            location.selected,
            hostingTypes.price,
            setupFees.price,
            price.toFixed(2),
            emailAccounts.price,
            sslCertificate.price,
            location.price
        );
    }

    function emailAccountClick(item) {
        const monthlyPrice = item * emailAccounts.unitPrice;
        const months = item * emailAccounts.quantity;
        const price = months * emailAccounts.unitPrice;

        console.log(months);

        setEmailAccounts((prevState) => {
            return {
                ...prevState,
                selected: item,
                price: price.toFixed(2),
                monthlyPrice: monthlyPrice.toFixed(2)
            };
        });

        workOutTotals(
            hostingTypes.selected,
            domainName.selected,
            sslCertificate.selected,
            location.selected,
            hostingTypes.price,
            setupFees.price,
            domainName.price,
            price,
            sslCertificate.price,
            location.price
        );
    }

    function sslCertificateSelectClick(item) {
        const price = parseFloat(item.unitPrice) * parseFloat(item.quantity);

        setSslCerticate((prevState) => {
            return { ...prevState, selected: item.item, unitPrice: item.unitPrice, quantity: item.quantity, price: price.toFixed(2) };
        });

        workOutTotals(
            hostingTypes.selected,
            domainName.selected,
            item.item,
            location.selected,
            hostingTypes.price,
            setupFees.price,
            domainName.price,
            emailAccounts.price,
            price.toFixed(2),
            location.price
        );
    }

    function locationSelectClick(item) {
        const price = parseFloat(item.unitPrice) * parseFloat(item.quantity);

        setLocation((prevState) => {
            return { ...prevState, selected: item.item, unitPrice: item.unitPrice, quantity: item.quantity, price: price.toFixed(2) };
        });

        workOutTotals(
            hostingTypes.selected,
            domainName.selected,
            sslCertificate.selected,
            item.item,
            hostingTypes.price,
            setupFees.price,
            domainName.price,
            emailAccounts.price,
            sslCertificate.price,
            price.toFixed(2)
        );
    }

    function workOutTotals(
        hostingSelected,
        domainNameSelected,
        sslCertSelected,
        locationSelected,
        hostingPrice,
        setupPrice,
        domainNamePrice,
        emailPrice,
        sslCertPrice,
        locationPrice
    ) {
        if (hostingSelected != "select" && domainNameSelected != "select" && sslCertSelected != "select" && locationSelected != "select") {
            const setupTotal =
                parseFloat(hostingPrice) +
                parseFloat(domainNamePrice) +
                parseFloat(emailPrice) +
                parseFloat(sslCertPrice) +
                parseFloat(locationPrice) +
                parseFloat(setupPrice);
            const yearTotal = parseFloat(hostingPrice) + parseFloat(domainNamePrice) + parseFloat(emailPrice) + parseFloat(sslCertPrice);

            setTotals((prevState) => {
                return { ...prevState, setupTotal: setupTotal.toFixed(2), yearlyTotal: yearTotal.toFixed(2) };
            });
        }
    }

    function handleChangeTab(tab) {
        setTab(tab);
    }

    function handleSubmitModalOpen() {
        if (
            hostingTypes.selected == "select" ||
            domainName.selected == "select" ||
            sslCertificate.selected == "select" ||
            location.selected == "select"
        ) {
            setModal({ header: "Submit to High-View Studios", error: true, message: "Incomplete quote! Please finish the quote", open: true });
        } else {
            setSubmitModal((prevState) => {
                return { ...prevState, name: "", email: "", additionalInfo: "", open: true };
            });
        }
    }

    function handleSumbitModalChangeFields(e) {
        const { name, value } = e.target;

        setSubmitModal((prevState) => {
            return { ...prevState, [name]: value };
        });
    }

    function handleSumbitModalChangeTextArea(e) {
        const { name, value } = e.target;

        const newLength = submitModal.maxLength - value.length;

        setSubmitModal((prevState) => {
            return { ...prevState, [name]: value, currentLeft: newLength };
        });
    }

    function handleSubmitQuoteData() {
        if (submitModal.name == "" || submitModal.email == "") {
            setModal({ header: "Submit to High-View Studios", error: true, message: "Name and Email are required to submit the quote", open: true });
        } else {
            setSubmitModal((prevState) => {
                return { ...prevState, open: false };
            });

            const values = {
                value_webType: hostingTypes.selected,
                value_domainName: domainName.selected,
                value_emailAccounts: emailAccounts.selected.toString(),
                value_sslCert: sslCertificate.selected,
                value_location: location.selected
            };

            const uPrices = {
                uPrice_webType: hostingTypes.unitPrice,
                uPrice_setup: setupFees.unitPrice,
                uPrice_domainName: domainName.unitPrice,
                uPrice_emailAccounts: emailAccounts.unitPrice,
                uPrice_sslCert: sslCertificate.unitPrice,
                uPrice_location: location.unitPrice
            };

            const quantities = {
                q_webType: hostingTypes.quantity,
                q_setup: setupFees.quantity,
                q_domainName: domainName.quantity,
                q_emailAccounts: emailAccounts.quantity,
                q_sslCert: sslCertificate.quantity,
                q_location: location.quantity
            };

            const prices = {
                price_webType: hostingTypes.price,
                price_setup: setupFees.price,
                price_domainName: domainName.price,
                price_emailAccounts: emailAccounts.price,
                price_sslCert: sslCertificate.price,
                price_location: location.price
            };

            const totalPrices = {
                total_setup: totals.setupTotal,
                total_yearly: totals.yearlyTotal
            };

            const details = {
                name: submitModal.name,
                email: submitModal.email,
                additionalInfo: submitModal.additionalInfo
            };

            const data = { values, uPrices, quantities, prices, totalPrices, details };

            Axios.post("/pods/websiteQuote/quoteSystem/submitQuote", data)
                .then((res) => {
                    const data = res.data;
                    if (data.error == "null") {
                        setModal({
                            header: "Submit to High-View Studios",
                            error: false,
                            message: "Your quote has been submitted to High-View Studios",
                            open: true
                        });
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    const browserTabSystem = (
        <div>
            <Row style={QuoteSystemStyles.tabRow}>
                <Col>
                    <div>
                        <Row>
                            <Col
                                style={tab == "Hosting and Domain Names" ? QuoteSystemStyles.selectedTab : QuoteSystemStyles.tab}
                                onClick={handleChangeTab.bind(this, "Hosting and Domain Names")}
                            >
                                Hosting and Domain Names
                            </Col>
                            <Col
                                style={tab == "Email Accounts" ? QuoteSystemStyles.selectedTab : QuoteSystemStyles.tab}
                                onClick={handleChangeTab.bind(this, "Email Accounts")}
                            >
                                Email Accounts
                            </Col>
                            <Col
                                style={tab == "Pods and Styling" ? QuoteSystemStyles.selectedTab : QuoteSystemStyles.tab}
                                onClick={handleChangeTab.bind(this, "Pods and Styling")}
                            >
                                Pods and Styling
                            </Col>
                            <Col
                                style={tab == "Maintenance" ? QuoteSystemStyles.selectedTab : QuoteSystemStyles.tab}
                                onClick={handleChangeTab.bind(this, "Maintenance")}
                            >
                                Maintenance
                            </Col>
                        </Row>
                        <Row>
                            <Col style={QuoteSystemStyles.tabContent}>
                                {tab == "Hosting and Domain Names" && (
                                    <div>
                                        <p>
                                            These two topics are what people mostly worry about first, where can I host my website? how do I get a
                                            domain for it? Here, it is all done for you in the setup package. This package will get you up a running
                                            with a basic website, and a working domain name so that your customers can go straight to it. The Hosting
                                            and domains are maintained for you so you don&#39;t need to worry about that. <br /> <br />
                                            To host a website, the minimum contract is one year and the year will start when you site go live after
                                            the setup package. This can take up to six weeks to complete, depending on the size of the website. Near
                                            to the end of the contract you will be asked if you want to extend the contract, this will be done two
                                            months before it expires to avoid any downtime on changing over contracts. <br /> <br />
                                            The domain names are simple, they are always on a two year lease.
                                        </p>
                                    </div>
                                )}
                                {tab == "Email Accounts" && (
                                    <div>
                                        <p>
                                            Do you want your own email to go with your website? High-View Studios can provide you with 2GB of space
                                            for emails and attachments. You can pick up an email account for only £{emailAccounts.unitPrice} per
                                            month. Please use the contact page if you are interested.
                                        </p>
                                    </div>
                                )}
                                {tab == "Pods and Styling" && (
                                    <div>
                                        <p>
                                            With the Joomla content system, they are many extensions you can use on your website, connect with
                                            Facebook, have a photo galley, downloads or even a shopping cart. High-View Studios will install and
                                            configure all extensions for you so all you have to do is enjoy them. Some extensions you do have to buy
                                            for and this will be an extra charge to High-View Studios, you pay us and we will buy them. <br /> <br />
                                            You can also have your own styles in joomla but again these are not free, a maximum of £15 per style, but
                                            its simple, you pick a style from a selected website, you pay High-View Studios, we buy them and install
                                            them too.
                                        </p>
                                    </div>
                                )}
                                {tab == "Maintenance" && (
                                    <div>
                                        <p>
                                            All the websites are maintained to make sure they are running 100%. This maintenance include, backups,
                                            upgrades and monthly reports. You can have a web master in your business or organisation that can have
                                            more access to the website to develop it, although if you have not got a person like that, High-View
                                            Studios will take on more responsibility of becoming the web master of your website. This may cost you
                                            more, depending what you want on the website. <br /> <br />
                                            There is a service charge in place for more complex problems, add-ons and upgrades that High-View Studios
                                            have to some some time on. This will cost an extra £5 for each task.
                                        </p>
                                    </div>
                                )}
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    );

    const mobileTabSystem = (
        <div>
            <Row style={QuoteSystemStyles.tabRow}>
                <Col>
                    <div>
                        <Row>
                            <Col
                                style={tab == "Hosting and Domain Names" ? QuoteSystemStyles.m_selectedTab : QuoteSystemStyles.m_tab}
                                onClick={handleChangeTab.bind(this, "Hosting and Domain Names")}
                            >
                                Hosting and Domain Names
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                style={tab == "Email Accounts" ? QuoteSystemStyles.m_selectedTab : QuoteSystemStyles.m_tab}
                                onClick={handleChangeTab.bind(this, "Email Accounts")}
                            >
                                Email Accounts
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                style={tab == "Pods and Styling" ? QuoteSystemStyles.m_selectedTab : QuoteSystemStyles.m_tab}
                                onClick={handleChangeTab.bind(this, "Pods and Styling")}
                            >
                                Pods and Styling
                            </Col>
                        </Row>
                        <Row>
                            <Col
                                style={tab == "Maintenance" ? QuoteSystemStyles.m_selectedTab : QuoteSystemStyles.m_tab}
                                onClick={handleChangeTab.bind(this, "Maintenance")}
                            >
                                Maintenance
                            </Col>
                        </Row>
                        <Row>
                            <Col style={QuoteSystemStyles.m_tabContent}>
                                {tab == "Hosting and Domain Names" && (
                                    <div>
                                        <p>
                                            These two topics are what people mostly worry about first, where can I host my website? how do I get a
                                            domain for it? Here, it is all done for you in the setup package. This package will get you up a running
                                            with a basic website, and a working domain name so that your customers can go straight to it. The Hosting
                                            and domains are maintained for you so you don&#39;t need to worry about that. <br /> <br />
                                            To host a website, the minimum contract is one year and the year will start when you site go live after
                                            the setup package. This can take up to six weeks to complete, depending on the size of the website. Near
                                            to the end of the contract you will be asked if you want to extend the contract, this will be done two
                                            months before it expires to avoid any downtime on changing over contracts. <br /> <br />
                                            The domain names are simple, they are always on a two year lease.
                                        </p>
                                    </div>
                                )}
                                {tab == "Email Accounts" && (
                                    <div>
                                        <p>
                                            Do you want your own email to go with your website? High-View Studios can provide you with 2GB of space
                                            for emails and attachments. You can pick up an email account for only £{emailAccounts.unitPrice} per
                                            month. Please use the contact page if you are interested.
                                        </p>
                                    </div>
                                )}
                                {tab == "Pods and Styling" && (
                                    <div>
                                        <p>
                                            With the Joomla content system, they are many extensions you can use on your website, connect with
                                            Facebook, have a photo galley, downloads or even a shopping cart. High-View Studios will install and
                                            configure all extensions for you so all you have to do is enjoy them. Some extensions you do have to buy
                                            for and this will be an extra charge to High-View Studios, you pay us and we will buy them. <br /> <br />
                                            You can also have your own styles in joomla but again these are not free, a maximum of £15 per style, but
                                            its simple, you pick a style from a selected website, you pay High-View Studios, we buy them and install
                                            them too.
                                        </p>
                                    </div>
                                )}
                                {tab == "Maintenance" && (
                                    <div>
                                        <p>
                                            All the websites are maintained to make sure they are running 100%. This maintenance include, backups,
                                            upgrades and monthly reports. You can have a web master in your business or organisation that can have
                                            more access to the website to develop it, although if you have not got a person like that, High-View
                                            Studios will take on more responsibility of becoming the web master of your website. This may cost you
                                            more, depending what you want on the website. <br /> <br />
                                            There is a service charge in place for more complex problems, add-ons and upgrades that High-View Studios
                                            have to some some time on. This will cost an extra £5 for each task.
                                        </p>
                                    </div>
                                )}
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    );

    return (
        <div style={QuoteSystemStyles.body}>
            <Row>
                <Col>
                    <div style={{ ...QuoteSystemStyles.container, ...QuoteSystemStyles.topContainer }}>
                        <h2>Web Development</h2>
                        <p>
                            High-View Studios can develop and/or maintain your websites Using a Joomla based system your website will be easy to use
                            and navigate around it. The system will enable you as the end users to update the content on the website yourselves. At a
                            responsible cost you can have a good website to advertise who you are, whether your a business or a charity. High-View
                            Studios can provide you with the best website that suits you the most!
                        </p>
                    </div>
                </Col>
            </Row>
            <br />
            {isBrowser ? browserTabSystem : mobileTabSystem}
            <br />
            <Row>
                <Col>
                    <div style={{ ...QuoteSystemStyles.container, ...QuoteSystemStyles.topContainer }}>
                        <h2>Get A Quote</h2>
                    </div>
                </Col>
            </Row>
            <br />
            <Row>
                <Col md={7}>
                    <div style={QuoteSystemStyles.container}>
                        <Row>
                            <Col style={QuoteSystemStyles.categoryHeadings}>Hosting Type:</Col>
                            <Col>
                                <Dropdown>
                                    <Dropdown.Toggle variant="warning" style={QuoteSystemStyles.dropdownText}>
                                        {hostingTypes.selected}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {hostingTypes.items.map((item, index) => {
                                            return (
                                                <Dropdown.Item onClick={hostingTypeSelectClick.bind(this, item)} key={index}>
                                                    {item.item}
                                                </Dropdown.Item>
                                            );
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col style={QuoteSystemStyles.categoryHeadings}>Domain Name:</Col>
                            <Col>
                                <Dropdown>
                                    <Dropdown.Toggle variant="warning" style={QuoteSystemStyles.dropdownText}>
                                        {domainName.selected}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {domainName.items.map((item, index) => {
                                            return (
                                                <Dropdown.Item onClick={domainNameSelectClick.bind(this, item)} key={index}>
                                                    {item.item}
                                                </Dropdown.Item>
                                            );
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col style={QuoteSystemStyles.categoryHeadings}>Email Accounts:</Col>
                            <Col>
                                <Dropdown>
                                    <Dropdown.Toggle variant="warning" style={QuoteSystemStyles.dropdownText}>
                                        {emailAccounts.selected}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {emailAccounts.items.map((item, index) => {
                                            return (
                                                <Dropdown.Item onClick={emailAccountClick.bind(this, item)} key={index}>
                                                    {item}
                                                </Dropdown.Item>
                                            );
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col style={QuoteSystemStyles.categoryHeadings}>SSL Certificate:</Col>
                            <Col>
                                <Dropdown>
                                    <Dropdown.Toggle variant="warning" style={QuoteSystemStyles.dropdownText}>
                                        {sslCertificate.selected}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {sslCertificate.items.map((item, index) => {
                                            return (
                                                <Dropdown.Item onClick={sslCertificateSelectClick.bind(this, item)} key={index}>
                                                    {item.item}
                                                </Dropdown.Item>
                                            );
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col style={QuoteSystemStyles.categoryHeadings}>Location:</Col>
                            <Col>
                                <Dropdown>
                                    <Dropdown.Toggle variant="warning" style={QuoteSystemStyles.dropdownText}>
                                        {location.selected}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {location.items.map((item, index) => {
                                            return (
                                                <Dropdown.Item onClick={locationSelectClick.bind(this, item)} key={index}>
                                                    {item.item}
                                                </Dropdown.Item>
                                            );
                                        })}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <Col style={QuoteSystemStyles.submitBtnCol}>
                                <Button variant="warning" style={QuoteSystemStyles.submitBtn} onClick={handleSubmitModalOpen}>
                                    Submit to High-ViewStudios
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col md={5}>
                    <div style={QuoteSystemStyles.container}>
                        <Table style={QuoteSystemStyles.itemsTable} bordered>
                            <thead>
                                <tr>
                                    <th style={QuoteSystemStyles.tableHeadings}>Item</th>
                                    <th style={QuoteSystemStyles.tableHeadings}>Unit Price</th>
                                    <th style={QuoteSystemStyles.tableHeadings}>Quantity</th>
                                    <th style={QuoteSystemStyles.tableHeadings}>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Hosting Type</td>
                                    <td>{hostingTypes.unitPrice != "" ? `£${hostingTypes.unitPrice}` : 0}</td>
                                    <td>{hostingTypes.unitPrice != "" ? hostingTypes.quantity : 0}</td>
                                    <td>{hostingTypes.unitPrice != "" ? `£${hostingTypes.price}` : 0}</td>
                                </tr>
                                <tr>
                                    <td>Setup Fee</td>
                                    <td>{setupFees.unitPrice != "" ? `£${setupFees.unitPrice}` : 0}</td>
                                    <td>{setupFees.unitPrice != "" ? setupFees.quantity : 0}</td>
                                    <td>{setupFees.unitPrice != "" ? `£${setupFees.price}` : 0}</td>
                                </tr>
                                <tr>
                                    <td>Domain Name</td>
                                    <td>{domainName.unitPrice != "" ? `£${domainName.unitPrice}` : 0}</td>
                                    <td>{domainName.unitPrice != "" ? domainName.quantity : 0}</td>
                                    <td>{domainName.unitPrice != "" ? `£${domainName.price}` : 0}</td>
                                </tr>
                                <tr>
                                    <td>
                                        Email Accounts <br /> ({emailAccounts.unitPrice} per account)
                                    </td>
                                    <td>
                                        {emailAccounts.price != "0" ? (
                                            <div>
                                                £{emailAccounts.monthlyPrice} <br /> (£{emailAccounts.unitPrice} x {emailAccounts.selected})
                                            </div>
                                        ) : (
                                            0
                                        )}
                                    </td>
                                    <td>{emailAccounts.price != "0" ? emailAccounts.quantity : 0}</td>
                                    <td>{emailAccounts.price != "0" ? `£${emailAccounts.price}` : 0}</td>
                                </tr>
                                <tr>
                                    <td>SSL Certificate</td>
                                    <td>{sslCertificate.unitPrice != "" ? `£${sslCertificate.unitPrice}` : 0}</td>
                                    <td>{sslCertificate.unitPrice != "" ? sslCertificate.quantity : 0}</td>
                                    <td>{sslCertificate.unitPrice != "" ? `£${sslCertificate.price}` : 0}</td>
                                </tr>
                                <tr>
                                    <td>Location</td>
                                    <td>{location.price > 0 ? `£${location.price}` : 0}</td>
                                    <td>{location.price > 0 ? location.quantity : 0}</td>
                                    <td>{location.price > 0 ? `£${location.price}` : 0}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3} style={QuoteSystemStyles.totalRows}>
                                        Total Setup Cost
                                        <br />
                                        (incuding first year hosting)
                                    </td>
                                    <td>{totals.setupTotal > 0 ? `£${totals.setupTotal}` : 0}</td>
                                </tr>
                                <tr>
                                    <td colSpan={3} style={QuoteSystemStyles.totalRows}>
                                        Total Yearly Cost
                                    </td>
                                    <td>{totals.yearlyTotal > 0 ? `£${totals.yearlyTotal}` : 0}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
            <Modal show={submitModal.open} onHide={handleSubmitModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Submit to High-View Studios</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col sm={2} style={QuoteSystemStyles.submitModalTitles}>
                            Name:
                        </Col>
                        <Col sm={10}>
                            <Form.Control type="text" name="name" onChange={handleSumbitModalChangeFields} value={submitModal.name} />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col sm={2} style={QuoteSystemStyles.submitModalTitles}>
                            Email:
                        </Col>
                        <Col sm={10}>
                            <Form.Control type="text" name="email" onChange={handleSumbitModalChangeFields} value={submitModal.email} />
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>Additional Information:</Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name="additionalInfo"
                                onChange={handleSumbitModalChangeTextArea}
                                value={submitModal.additionalInfo}
                                maxLength={submitModal.maxLength}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col style={QuoteSystemStyles.lengthCounter}>{submitModal.currentLeft}</Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleSubmitModalClose}>Close</Button>
                    <Button onClick={handleSubmitQuoteData}>Submit</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={modal.open} onHide={handleCloseModal}>
                <Modal.Header closeButton style={modal.error ? UploadStyles.errorModalColor : UploadStyles.successModalColor}>
                    <Modal.Title>{modal.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modal.message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default QuoteSystem;
