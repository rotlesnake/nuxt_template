<template>
    <div id="app">
        <fancy-grid-vue :config="gridConfig"></fancy-grid-vue>
    </div>
</template>

<script>
import FancyGridVue from "fancy-grid-vue";

let data = [
    {
        name: "Ted",
        surname: "Smith",
        position: "Java Developer",
        email: "ted.smith@gmail.com",
        company: "Electrical Systems",
        age: 30,
        knownledge: "Java, Ruby",
    },
    {
        name: "Ed",
        surname: "Johnson",
        position: "C/C++ Market Data Developer",
        email: "ed.johnson@gmail.com",
        company: "Energy and Oil",
        age: 35,
        knownledge: "C++",
    },
    {
        name: "Sam",
        surname: "Williams",
        position: "Technical Analyst",
        email: "sam.williams@gmail.com",
        company: "Airbus",
        age: 38,
        knownledge: "",
    },
    {
        name: "Alexander",
        surname: "Brown",
        position: "Project Manager",
        email: "alexander.brown@gmail.com",
        company: "Renault",
        age: 24,
        knownledge: "",
    },
    {
        name: "Nicholas",
        surname: "Miller",
        position: "Senior Software Engineer",
        email: "nicholas.miller@gmail.com",
        company: "Adobe",
        age: 33,
        knownledge: "Unix, C/C++",
    },
    {
        name: "Andrew",
        surname: "Thompson",
        position: "Agile Project Manager",
        email: "andrew.thompson@gmail.com",
        company: "Google",
        age: 28,
        knownledge: "",
    },
    {
        name: "Ryan",
        surname: "Walker",
        position: "Application Support Engineer",
        email: "ryan.walker@gmail.com",
        company: "Siemens",
        age: 39,
        knownledge: "ActionScript",
    },
    {
        name: "John",
        surname: "Scott",
        position: "Flex Developer",
        email: "john.scott@gmail.com",
        company: "Cargo",
        age: 45,
        knownledge: "Flex",
    },
];

export default {
    name: "app",
    data: function () {
        return {
            gridConfig: {
                title: "Vue with FancyGrid",
                theme: "gray",
                width: "100%",
                height: "calc(100vh - 50px)",
                data: data,
                resizable: true,
                defaults: {
                    type: "string",
                    width: 100,
                    sortable: true,
                    editable: true,
                    resizable: true,
                },
                selModel: "rows",
                trackOver: true,
                columns: [
                    {
                        type: "select",
                    },
                    {
                        index: "company",
                        title: "Company",
                    },
                    {
                        index: "name",
                        title: "Name",
                    },
                    {
                        index: "surname",
                        title: "Sur Name",
                    },
                    {
                        index: "age",
                        title: "Age",
                        type: "number",
                        width: 80,
                    },
                    {
                        index: "email",
                        title: "Email",
                        width: 160,
                    },
                ],
            },
        };
    },
    components: {
        FancyGridVue,
    },
};
</script>
